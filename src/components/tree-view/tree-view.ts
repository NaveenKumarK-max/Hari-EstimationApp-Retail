import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Events } from 'ionic-angular';
@Component({
    selector: 'tree-view',
    templateUrl:  'tree-view.html'
})
export class TreeView {
    @Input() TreeData: any[];
    @Input() hasCheckbox: boolean = true;
    @Output() selected = new EventEmitter();

    constructor(private events: Events) { }

    toggleChildren(node: any) {
        node.visible = !node.visible;
        node.icon = (node.visible == true ? "arrow-dropdown-circle" : "arrow-dropright-circle");
    }

    prodSelected(prodData){
        this.events.publish('treeProd:selected', prodData);
    }

}