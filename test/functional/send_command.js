describe('send command', function () {
  it('should support callback', function (done) {
    var redis = new Redis();
    redis.set('foo', 'bar');
    redis.get('foo', function (err, result) {
      expect(result).to.eql('bar');
      done();
    });
  });

  it('should support promise', function () {
    var redis = new Redis();
    redis.set('foo', 'bar');
    return redis.get('foo').then(function (result) {
      expect(result).to.eql('bar');
    });
  });

  it('should keep the response order when mix using callback & promise', function (done) {
    var redis = new Redis();
    var order = 0;
    redis.get('foo').then(function () {
      expect(++order).to.eql(1);
    });
    redis.get('foo', function () {
      expect(++order).to.eql(2);
    });
    redis.get('foo').then(function () {
      expect(++order).to.eql(3);
    });
    redis.get('foo', function () {
      expect(++order).to.eql(4);
      done();
    });
  });

  it('should support get & set buffer', function (done) {
    var redis = new Redis();
    redis.set(new Buffer('foo'), new Buffer('bar'));
    redis.getBuffer(new Buffer('foo'), function (err, result) {
      expect(result).to.be.instanceof(Buffer);
      expect(result.toString()).to.eql('bar');
      done();
    });
  });

  it('should handle empty buffer', function (done) {
    var redis = new Redis();
    redis.set(new Buffer('foo'), new Buffer(''));
    redis.getBuffer(new Buffer('foo'), function (err, result) {
      expect(result).to.be.instanceof(Buffer);
      expect(result.toString()).to.eql('');
      done();
    });
  });

  it('should support utf8', function (done) {
    var redis = new Redis();
    redis.set(new Buffer('你好'), new String('你好'));
    redis.getBuffer('你好', function (err, result) {
      expect(result.toString()).to.eql('你好');
      redis.get('你好', function (err, result) {
        expect(result).to.eql('你好');
        done();
      });
    });
  });

  it('should consider null as empty str', function (done) {
    var redis = new Redis();
    redis.set('foo', null, function () {
      redis.get('foo', function (err, res) {
        expect(res).to.eql('');
        done();
      });
    });
  });

  it('should support return int value', function (done) {
    var redis = new Redis();
    redis.exists('foo', function (err, exists) {
      expect(typeof exists).to.eql('number');
      done();
    });
  });
});
