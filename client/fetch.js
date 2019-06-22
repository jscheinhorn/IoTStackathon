const poll = async () => {
  const x = await fetch('http://esp8266.local')
  // console.log(await x.json())
  setTimeout(poll, 1000)
}

setTimeout(poll, 1000)

export default poll
