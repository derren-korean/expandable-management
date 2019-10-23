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
  @ViewChild('', { static: true }) serachbarInput: string;

  private listActive = false;
  private items: ItemView[] = [];

  constructor(private common: DeviceCommon) { }

  initializeItems() {
    this.items = [...this.itemViewArr];
    this.itemSelected.emit(null);
  }

  getItems(ev: any) {
    this.initializeItems();
    const term: string = ev.target.value;
    if (term && term.trim() != '') {
      this.listActive = true;
      this.items = this.items.reduce((result: ItemView[], item: ItemView) => this.includeAnySpell(result, item, term), []);
    } else {
      this.listActive = false;
    }
  }

  includeAnySpell = (result: ItemView[], item: ItemView, term: string) => {
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

  fillSearchbarText(title: string) {
    this.serachbarInput = title;
    this.listActive = false;
    this.itemSelected.emit(title);
  }

}
