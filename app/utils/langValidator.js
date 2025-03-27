const allowedLanguages = ['uk', 'en']

const langValidator = {
  validator: function (valueMap) {
    const keys = Array.from(valueMap.keys())

    const hasAllLanguages = allowedLanguages.every((lang) => keys.includes(lang))
    const allKeysValid = keys.every((lang) => allowedLanguages.includes(lang))

    return hasAllLanguages && allKeysValid
  },
  message: (props) => {
    const keys = Array.from(props.value.keys()) // Map
    let errorMsg = ''

    const missingLangs = allowedLanguages.filter((lang) => !keys.includes(lang))
    if (missingLangs && missingLangs.length > 0) {
      errorMsg = `Missing languages: ${missingLangs.join(", ")}.`
    }

    const invalidLang = keys.find((lang) => !allowedLanguages.includes(lang))
    if (invalidLang) {
      errorMsg = `Language "${invalidLang}" is not allowed. Allowed languages: ${allowedLanguages.join(", ")}`;
    }

    return errorMsg || "Invalid language format."
  }
}

module.exports = {
  langs: allowedLanguages,
  langValidator
}
