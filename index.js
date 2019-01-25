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
  let _regex
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

  const _check = (term) => (!_regex || _regex.test(term))

  const _getRegexString = () => _regexString

  return {
    add: _add,
    check: _check,
    getRegexString: _getRegexString
  }
}

module.exports = Blacklist

