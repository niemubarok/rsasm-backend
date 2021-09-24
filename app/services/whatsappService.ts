import axios from 'axios'

const sendWhatsappMessage = (data: object) => {
  try {
    axios.post('http://192.168.7.250:3000/send', data).then((response) => {
      console.log(response)
    })
    return 'sukses'
  } catch (error) {
    console.log(error)
  }
}

export { sendWhatsappMessage }
