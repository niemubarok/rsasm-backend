import axios from 'axios'

const sendWhatsappMessage = (data: object) => {
  try {
    axios.post('http://103.78.215.58:3000/send', data).then((response) => {
      console.log(response)
    })
    return 'sukses'
  } catch (error) {
    console.log(error)
  }
}

export { sendWhatsappMessage }
