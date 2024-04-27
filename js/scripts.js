const { ipcRenderer } = require('electron')

let uuid = crypto.randomUUID()
// uuid = '123456789'

function generateQr() {
  new QRCode('qrcode', {
    text: uuid,
    width: 200,
    height: 200
  })
}

const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
  clean: true,
  connectTimeout: 4000,
  clientId: `sc-${uuid.substring(0, 7)}`
})

client.on('connect', function () {
  generateQr()

  client.subscribe(`slider-controller/${uuid}`, function (err) {
    if (!err) {
      client.publish(`slider-controller/${uuid}/ping`, 'ok')
    }
  })
})

client.on('message', function (topic, message) {
  if (topic == `slider-controller/${uuid}`) {
    ipcRenderer.send('command', message.toString())
  }
})
