const setUrl = (imgUrl) => {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  const project = process.env.CLOUDINARY_PROJECT
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${project}/${imgUrl}`
}

module.exports = { setUrl }