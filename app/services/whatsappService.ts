import axios from 'axios'

const sendWhatsappMessage = async (data: object) => {
  try {
    axios.post(process.env.WHATSAPP_ENDPOINT + 'send', data)
  } catch (error) {
    console.log(error)
  }
}

export { sendWhatsappMessage }
