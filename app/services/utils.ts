import QRCode from 'qrcode'

const createQRCode = () => {
  return QRCode.toDataURL('https://rsasm.vercel.app/#/').then((url) => {
    return url
  })
}

export { createQRCode }
