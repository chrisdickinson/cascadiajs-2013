suite('test of bops', function() {
  var assert = require('assert')
    , bops = require('bops')

  setup(function() {
    console.log('hello')
  })

  suite('blorp', function() {
    setup(function() {
      console.log('womp')
    })

    test('from array works', function(done) {
      var arr = [1, 2, 3]
        , buf = bops.from(arr)

      assert.strictEqual(buf.length, arr.length)
      for(var i = 0, len = arr.length; i < len; ++i) {
        assert.strictEqual(bops.readUInt8(buf, i), arr[i])
      }
      done()
    })

    test('from utf8 works as expected', function(done) {
      var buf = bops.from('ƒello 淾淾淾 hello world 淾淾 yep ƒuu 淾 \ud83d\ude04', 'utf8')
        , expect

      expect = [198,146,101,108,108,111,32,230,183,190,230,183,190,230,183,190,32,104,101,108,108,111,32,119,111,114,108,100,32,230,183,190,230,183,190,32,121,101,112,32,198,146,117,117,32,230,183,190,32,0xF0,0x9F,0x98,0x84]

      assert.strictEqual(buf.length, expect.length)
      for(var i = 0, len = buf.length; i < len; ++i) {
        assert.strictEqual(bops.readUInt8(buf, i), expect[i])
      }

      done()
    })
  })

  test('from hex works as expected', function(done) {
    var buf = bops.from('68656c6c6f20776f726c64c692000a0809', 'hex')
      , expect

    expect = [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 198, 146, 0, 10, 8, 9]

    assert.strictEqual(buf.length, expect.length)
    for(var i = 0, len = buf.length; i < len; ++i) {
      assert.strictEqual(bops.readUInt8(buf, i), expect[i])
    }

    done()
  })

  test('from base64 works as expected', function(done) {
    var buf = bops.from('aGVsbG8gd29ybGTGkgAKCAk=', 'base64')
      , expect

    expect = [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 198, 146, 0, 10, 8, 9]

    assert.strictEqual(buf.length, expect.length)
    for(var i = 0, len = buf.length; i < len; ++i) {
      assert.strictEqual(bops.readUInt8(buf, i), expect[i])
    }

    done()
  })

})
