import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-type': 'application/json',
    'User-Agent': 'GeoLook/1.0 (olkakorolcuk@gmail.com)',
    Referer: window.location.origin,
  },
})
