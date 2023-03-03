import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { eLoadingState, FlowComponent, FlowField, FlowObjectData, FlowObjectDataArray } from "flow-component-model";
import React from "react";
import { CSSProperties } from "react";
import './CartButton.css';

declare const manywho: any;

/*
This class shows a button on the page with a shopping cart logo.
It uses the flow field defined in the this.getAttribute("countField") as a coulter of the number of items.
It overlays this value on top of the cart logo.
On pressing this button it will trigger an outcome explicitly named onCart or the first outcome attached
*/
export default class CartButton extends FlowComponent {

    constructor(props: any){
        super(props);
        this.moveHappened = this.moveHappened.bind(this);
        this.prepButton = this.prepButton.bind(this);
        this.showCart = this.showCart.bind(this);
        this.state = {count: 0}
    }

    async componentDidMount(){
        await super.componentDidMount();   
        (manywho as any).eventManager.addDoneListener(this.moveHappened, this.componentId);
        this.prepButton();
    }

    async componentWillUnmount(): Promise<void> {
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    moveHappened(xhr: XMLHttpRequest, request: any) {
        if ((xhr as any).invokeType === 'FORWARD') {
            this.prepButton();
        }
    }

    async prepButton() {
        if(this.loadingState === eLoadingState.ready) {
            let fldName = this.getAttribute("countField");
            if(fldName) {
                let countField: FlowField = await this.loadValue(fldName);
                if(countField) {
                    let basketCount: number = countField.value as number;
                    this.setState({count: basketCount});
                }
            }
        }
        else {
            setImmediate(this.prepButton);
        }
    }

    async showCart() {
        if(this.outcomes["onCart"]) {
            this.triggerOutcome("onCart")
        }
        else {
            if(Object.keys(this.outcomes).length > 0) {
                let firstOutcomeName: string = Object.keys(this.outcomes).values().next().value;
                this.triggerOutcome(firstOutcomeName);
            }
        }
    }

    render() {
        const style: CSSProperties = {};
        style.width = '-webkit-fill-available';
        style.height = '-webkit-fill-available';

        if (this.model.visible === false) {
            style.display = 'none';
        }
        if (this.model.width) {
            style.width = this.model.width + 'px';
        }
        if (this.model.height) {
            style.height = this.model.height + 'px';
        }

        let marker: any;
        if(this.state.count > 0) {
            marker = (
                <span 
                    className='cartbutton-marker'
                >
                    <span 
                        className='cartbutton-count'
                    >
                        {this.state.count}
                    </span>
                </span>
            );
        }

        return (
            <div
                className='cartbutton'
                onClick={this.showCart}
                title={this.model.label}
            >
                <FontAwesomeIcon 
                    className='cartbutton-icon'
                    icon={faShoppingCart}
                />
                {marker}
            </div>
        );
    }
}

manywho.component.register('CartButton', CartButton);