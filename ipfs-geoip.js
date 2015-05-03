// countries is added in make all
var COUNTRIES = {}

function aton4 (a) {
  a = a.split(/\./)
  return ((parseInt(a[0], 10)<<24)>>>0) + ((parseInt(a[1], 10)<<16)>>>0) + ((parseInt(a[2], 10)<<8)>>>0) + (parseInt(a[3], 10)>>>0)
}

function formatData (data) {
  var obj = {}
  if (data[0]) {
    var cc = data[0]
    obj.country_code = cc
    if (COUNTRIES[cc]) {
      obj.country_name = COUNTRIES[cc]
    }
  }
  if (data[1]) obj.region_code = data[1]
  if (data[2]) obj.city = data[2]
  if (data[3]) obj.postal_code = data[3]
  if (data[4]) obj.latitude = parseFloat(data[4])
  if (data[5]) obj.longitude = parseFloat(data[5])
  if (data[6]) obj.metro_code = data[6]
  if (data[7]) obj.area_code = data[7]

  return obj
}

function _lookup (ipfs, hash, lookfor, cb) {
  ipfs.object.get(hash, function (err, res) {
    if (err) {
      cb(err, null)
    } else {
      var obj = JSON.parse(res.Data)

      var child = 0;
      if (obj.type == 'Node') {
        while (obj.mins[child] &&
               obj.mins[child] <= lookfor) {
          child++
        }
        return _lookup(ipfs, res.Links[child-1].Hash, lookfor, cb)
      } else if (obj.type == 'Leaf') {
        while (obj.data[child] &&
               obj.data[child].min <= lookfor) {
          child++
        }
        if (obj.data[child-1].data) {
          cb(null, formatData(obj.data[child-1].data))
        } else {
          cb("Unmapped range", null)
        }
      }
    }
  })
}

function lookup (ipfs, hash, ip, cb) {
  _lookup(ipfs, hash, aton4(ip), cb)
}

module.exports = {lookup: lookup,
                  _lookup: _lookup};
COUNTRIES = {"AC":"Ascension Island","AD":"Andorra","AE":"United Arab Emirates","AF":"Afghanistan","AG":"Antigua And Barbuda","AI":"Anguilla","AL":"Albania","AM":"Armenia","AO":"Angola","AQ":"Antarctica","AR":"Argentina","AS":"American Samoa","AT":"Austria","AU":"Australia","AW":"Aruba","AX":"Åland Islands","AZ":"Azerbaijan","BA":"Bosnia & Herzegovina","BB":"Barbados","BD":"Bangladesh","BE":"Belgium","BF":"Burkina Faso","BG":"Bulgaria","BH":"Bahrain","BI":"Burundi","BJ":"Benin","BL":"Saint Barthélemy","BM":"Bermuda","BN":"Brunei Darussalam","BO":"Bolivia, Plurinational State Of","BQ":"Bonaire, Saint Eustatius And Saba","BR":"Brazil","BS":"Bahamas","BT":"Bhutan","BV":"Bouvet Island","BW":"Botswana","BY":"Belarus","BZ":"Belize","CA":"Canada","CC":"Cocos (Keeling) Islands","CD":"Democratic Republic Of Congo","CF":"Central African Republic","CG":"Republic Of Congo","CH":"Switzerland","CI":"Cote d'Ivoire","CK":"Cook Islands","CL":"Chile","CM":"Cameroon","CN":"China","CO":"Colombia","CP":"Clipperton Island","CR":"Costa Rica","CU":"Cuba","CV":"Cabo Verde","CW":"Curacao","CX":"Christmas Island","CY":"Cyprus","CZ":"Czech Republic","DE":"Germany","DG":"Diego Garcia","DJ":"Djibouti","DK":"Denmark","DM":"Dominica","DO":"Dominican Republic","DZ":"Algeria","EA":"Ceuta, Mulilla","EC":"Ecuador","EE":"Estonia","EG":"Egypt","EH":"Western Sahara","ER":"Eritrea","ES":"Spain","ET":"Ethiopia","EU":"European Union","FI":"Finland","FJ":"Fiji","FK":"Falkland Islands","FM":"Micronesia, Federated States Of","FO":"Faroe Islands","FR":"France","FX":"France, Metropolitan","GA":"Gabon","GB":"United Kingdom","GD":"Grenada","GE":"Georgia","GF":"French Guiana","GG":"Guernsey","GH":"Ghana","GI":"Gibraltar","GL":"Greenland","GM":"Gambia","GN":"Guinea","GP":"Guadeloupe","GQ":"Equatorial Guinea","GR":"Greece","GS":"South Georgia And The South Sandwich Islands","GT":"Guatemala","GU":"Guam","GW":"Guinea-bissau","GY":"Guyana","HK":"Hong Kong","HM":"Heard Island And McDonald Islands","HN":"Honduras","HR":"Croatia","HT":"Haiti","HU":"Hungary","IC":"Canary Islands","ID":"Indonesia","IE":"Ireland","IL":"Israel","IM":"Isle Of Man","IN":"India","IO":"British Indian Ocean Territory","IQ":"Iraq","IR":"Iran, Islamic Republic Of","IS":"Iceland","IT":"Italy","JE":"Jersey","JM":"Jamaica","JO":"Jordan","JP":"Japan","KE":"Kenya","KG":"Kyrgyzstan","KH":"Cambodia","KI":"Kiribati","KM":"Comoros","KN":"Saint Kitts And Nevis","KP":"Korea, Democratic People's Republic Of","KR":"Korea, Republic Of","KW":"Kuwait","KY":"Cayman Islands","KZ":"Kazakhstan","LA":"Lao People's Democratic Republic","LB":"Lebanon","LC":"Saint Lucia","LI":"Liechtenstein","LK":"Sri Lanka","LR":"Liberia","LS":"Lesotho","LT":"Lithuania","LU":"Luxembourg","LV":"Latvia","LY":"Libya","MA":"Morocco","MC":"Monaco","MD":"Moldova","ME":"Montenegro","MF":"Saint Martin","MG":"Madagascar","MH":"Marshall Islands","MK":"Macedonia, The Former Yugoslav Republic Of","ML":"Mali","MM":"Myanmar","MN":"Mongolia","MO":"Macao","MP":"Northern Mariana Islands","MQ":"Martinique","MR":"Mauritania","MS":"Montserrat","MT":"Malta","MU":"Mauritius","MV":"Maldives","MW":"Malawi","MX":"Mexico","MY":"Malaysia","MZ":"Mozambique","NA":"Namibia","NC":"New Caledonia","NE":"Niger","NF":"Norfolk Island","NG":"Nigeria","NI":"Nicaragua","NL":"Netherlands","NO":"Norway","NP":"Nepal","NR":"Nauru","NU":"Niue","NZ":"New Zealand","OM":"Oman","PA":"Panama","PE":"Peru","PF":"French Polynesia","PG":"Papua New Guinea","PH":"Philippines","PK":"Pakistan","PL":"Poland","PM":"Saint Pierre And Miquelon","PN":"Pitcairn","PR":"Puerto Rico","PS":"Palestinian Territory, Occupied","PT":"Portugal","PW":"Palau","PY":"Paraguay","QA":"Qatar","RE":"Reunion","RO":"Romania","RS":"Serbia","RU":"Russian Federation","RW":"Rwanda","SA":"Saudi Arabia","SB":"Solomon Islands","SC":"Seychelles","SD":"Sudan","SE":"Sweden","SG":"Singapore","SH":"Saint Helena, Ascension And Tristan Da Cunha","SI":"Slovenia","SJ":"Svalbard And Jan Mayen","SK":"Slovakia","SL":"Sierra Leone","SM":"San Marino","SN":"Senegal","SO":"Somalia","SR":"Suriname","SS":"South Sudan","ST":"São Tomé and Príncipe","SU":"USSR","SV":"El Salvador","SX":"Sint Maarten","SY":"Syrian Arab Republic","SZ":"Swaziland","TC":"Turks And Caicos Islands","TA":"Tristan de Cunha","TD":"Chad","TF":"French Southern Territories","TG":"Togo","TH":"Thailand","TJ":"Tajikistan","TK":"Tokelau","TL":"East Timor","TM":"Turkmenistan","TN":"Tunisia","TO":"Tonga","TR":"Turkey","TT":"Trinidad And Tobago","TV":"Tuvalu","TW":"Taiwan, Province Of China","TZ":"Tanzania, United Republic Of","UA":"Ukraine","UG":"Uganda","UM":"United States Minor Outlying Islands","UK":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VA":"Vatican City State","VC":"Saint Vincent And The Grenadines","VE":"Venezuela, Bolivarian Republic Of","VG":"Virgin Islands (British)","VI":"Virgin Islands (US)","VN":"Viet Nam","VU":"Vanuatu","WF":"Wallis And Futuna","WS":"Samoa","YE":"Yemen","YT":"Mayotte","ZA":"South Africa","ZM":"Zambia","ZW":"Zimbabwe"};
