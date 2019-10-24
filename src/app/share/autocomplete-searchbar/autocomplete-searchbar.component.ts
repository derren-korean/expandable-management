import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DeviceCommon, ItemView } from '../device-common';

@Component({
  selector: 'app-autocomplete-searchbar',
  templateUrl: './autocomplete-searchbar.component.html',
  styleUrls: ['./autocomplete-searchbar.component.scss'],
})
export class AutocompleteSearchbarComponent {

  @Input() itemViewArr: ItemView[];
  @Output() itemSelected = new EventEmitter<string>();
  @ViewChild('', { static: true }) searchbarInput: string;

  private listActive = false;
  private items: ItemView[] = [];
  private cho_sung: string[] = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

  constructor(private common: DeviceCommon) { }

  private includeAnySpell = (result: ItemView[], item: ItemView, term: string) => {
    const include = (str: string) => str.toLowerCase().indexOf(term.toLowerCase()) > -1;
    const _hasSubtitle = item.subTitles.length > 0 && item.subTitles.some(alias => include(alias));
    if (include(item.title) || _hasSubtitle) {
      let _subTitles: string[] = []
      if (_hasSubtitle) {
        _subTitles = item.subTitles.filter(include);
      }
      result.push(new ItemView(item.title, _subTitles))
    }
    return result;
  }

  private is_hangul_cho_sung(str: string) {
    return this.cho_sung.some(cho => cho === str);
  }

  private fisrt_char_is_same = (str, term) => {
    const code = str.charCodeAt(0) - 44032;
    return term == this.cho_sung[Math.floor(code / 588)];
  }

  // 중복코드, 유지보수를 위해 리팩토링하지 않음. 아래와 같이 parameter 5개인 매쏘드를 만들면 됨.
  //(result, item, term, item.subTitles.length > 0 && item.subTitles.some(alias => this.fisrt_char_is_same(alias, term)), this.fisrt_char_is_same(item.title, term))
  private includeFirstHangul = (result: ItemView[], item: ItemView, term: string) => {
    const _hasSubtitle = item.subTitles.length > 0 && item.subTitles.some(alias => this.fisrt_char_is_same(alias, term));
    if (this.fisrt_char_is_same(item.title, term) || _hasSubtitle) {
      let _subTitles: string[] = []
      if (_hasSubtitle) {
        _subTitles = item.subTitles.filter(alias => this.fisrt_char_is_same(alias, term));
      }
      result.push(new ItemView(item.title, _subTitles))
    }
    return result;
  }

  filterItems(ev: any) {
    this.itemSelected.emit(null);
    const term: string = ev.target.value;
    if (term && term.trim() != '') {
      this.listActive = true;
      this.items = [...this.itemViewArr].reduce((result: ItemView[], item: ItemView) => this.includeAnySpell(result, item, term), []);
      if (this.items.length === 0 && term.length == 1 && this.is_hangul_cho_sung(term)) {
        this.items = [...this.itemViewArr].reduce((result: ItemView[], item: ItemView) => this.includeFirstHangul(result, item, term), []);
      }
    } else {
      this.listActive = false;
    }
  }

  fillSearchbarText(title: string) {
    this.searchbarInput = title;
    this.listActive = false;
    this.itemSelected.emit(title);
  }

}
