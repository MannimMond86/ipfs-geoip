var ipfs = require('ipfs-api')()

function aton4 (a) {
  a = a.split(/\./)
  return ((parseInt(a[0], 10)<<24)>>>0) + ((parseInt(a[1], 10)<<16)>>>0) + ((parseInt(a[2], 10)<<8)>>>0) + (parseInt(a[3], 10)>>>0)
}

function _lookup (hash, lookfor, cb) {

	console.log("lookup: ", hash)

  ipfs.object.get(hash, function (err, res) {
    var obj = JSON.parse(res.Data)

    var child = 0;
    if (obj.type == 'Node') {
      while (obj.mins[child] &&
						 obj.mins[child] < lookfor) {
        child++
      }
      return _lookup(res.Links[child-1].Hash, lookfor, cb)
    } else if (obj.type == 'Leaf') {
      while (obj.data[child] &&
						 obj.data[child].min < lookfor) {
        child++
      }
      cb(null, obj.data[child-1].data)
    }
  })
}

function lookup (hash, ip, cb) {
  _lookup(hash, aton4(ip), cb)
}

module.exports = {lookup: lookup,
                  _lookup: _lookup}