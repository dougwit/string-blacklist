const _substitutions = {
  a: ['4', '@'],
  e: ['3'],
  g: ['9'],
  i: ['1'],
  o: ['0'],
  s: ['$']
}

const _buildLookahead = string => {
  let _lookAhead = '(?!.*'

  for (let i = 0; i < string.length; i++) {
    const char = string[i]

    _lookAhead += '['
    _lookAhead += char.toUpperCase()
    _lookAhead += char.toLowerCase()
    
    if (_substitutions[char]) {
      _lookAhead += _substitutions[char].join('')
    }

    _lookAhead += ']'
  }

  _lookAhead += ')'

  return _lookAhead
}

const Blacklist = () => {
  let _regexString = ''
  let _regex = null
  let _blacklist = {}


  const _add = (term) => {
    const _normalizedTerm = term.toLowerCase()
    _blacklist[_normalizedTerm] = _buildLookahead(_normalizedTerm)

    if (_regex) {
      let _newRegexString = _regexString.substring(0, (_regexString.length - 3))
      _newRegexString += _blacklist[_normalizedTerm] + '.*$'
      _regexString = _newRegexString
    } else {
      _regexString = '^' + Object.values(_blacklist).join('') + '.*$'
    }
    
    _regex = new RegExp(_regexString)
  }

  const _getRegexString = () => _regexString

  const _remove = (term) => {
    if (_blacklist[term]) {
      _regexString = _regexString.replace(_blacklist[term], '')
      delete _blacklist[term]

      if (!Object.keys(_blacklist).length) {
        _regexString = ''
        _regex = null
      } else {
        _regex = new RegExp(_regexString)
      }
    }
  }

  const _validate = (term) => (!_regex || _regex.test(term))

  return {
    add: _add,
    getRegexString: _getRegexString,
    remove: _remove,
    validate: _validate
  }
}

module.exports = Blacklist

