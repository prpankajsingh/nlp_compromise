'use strict';
const is_acronym = require('./is_acronym');
const match = require('./match');
const fns = require('../fns');

class Term {
  constructor(str, tag) {
    //fail-safe
    if (str === null || str === undefined) {
      str = '';
    }
    str = (str).toString();
    //set .text
    this.text = str;
    //the normalised working-version of the word
    this.normal = '';
    // the simplified inflected, conjugated version
    // (akin to lemma or stem but full word)
    this.root = '';
    //if it's a contraction, the 'hidden word'
    this.implicit = '';
    //set .normal
    this.rebuild();
    //the reasoning behind it's part-of-speech
    this.reason = '';
    //these are orphaned POS that have no methods
    let types = {
      Determiner: 'Determiner',
      Conjunction: 'Conjunction',
      Preposition: 'Preposition',
      Posessive: 'Posessive',
      Expression: 'Expression'
    };
    this.pos = {};
    this.tag = types[tag] || '?';
    //record them in pos{}
    if (types[tag]) {
      this.pos[types[tag]] = true;
    }
  }

  //when the text changes, rebuild derivative fields
  rebuild() {
    this.text = this.text || '';
    this.text = this.text.trim();
    this.normal = '';
    this.normalize();
  }
  changeTo(str) {
    this.text = str;
    this.rebuild();
  }
  //a regex-like string search
  match(str, options) {
    return match(this, str, options);
  }

  //Term methods..
  has_comma() {
    if (this.text.match(/,$/)) {
      return true;
    }
    return false;
  }
  is_capital() {
    if (this.text.match(/[A-Z][a-z]/)) {
      return true;
    }
    return false;
  }
  //FBI or F.B.I.
  is_acronym() {
    return is_acronym(this.text);
  }
  //working word
  normalize() {
    let str = this.text || '';
    str = str.toLowerCase();
    str = str.replace(/[,\.!:;\?\(\)]/, '');
    str = str.replace(/’/g, '\'');
    str = str.replace(/"/g, '');
    // coerce single curly quotes
    str = str.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]+/g, '\'');
    // coerce double curly quotes
    str = str.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]+/g, '"');
    if (!str.match(/[a-z0-9]/i)) {
      return '';
    }
    this.normal = str;
    return this.normal;
  }
}

Term.fn = Term.prototype;
// let t = new Term('quick');
// console.log(t.lookup('(fun|nice|quick|cool)'));

module.exports = Term;
