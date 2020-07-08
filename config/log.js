module.exports = (log) => {
  const formatted = `
    //

      electron:
      ${log}
      
    //
  `
  console.log(formatted)
}
