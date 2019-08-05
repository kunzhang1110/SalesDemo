import React, { Component } from 'react';
import { Table, Dropdown } from 'semantic-ui-react';
import { SaleForm } from './SaleForm';
import { DeleteConfirm } from './DeleteConfirm';
import PropTypes from "prop-types";
import { Capitalize, formatDateToString } from "../utils"

export class SalePage extends Component {

    constructor(props) {
        super(props);
        this.state = { dataSet: [] ,fields:[]};
    }

    createOptionArray = (data) => {
        let options = data.map(c => {
            return {
                key: c.id,
                value: c.id,
                text: c.name
            }
        })
        options.sort((a, b) => {
            if (a.text < b.text) { return -1; }
            if (a.text > b.text) { return 1; }
            return 0;
        });
        return options;
    }

    getData = () => {
        fetch('/api/' + this.props.model)
            .then(
                response => response.json())
            .then(data => {
                var fields = Object.keys(data.sales[0]);
                this.setState({
                    dataSet: data.sales,
                    customerOptions: this.createOptionArray(data.customers),
                    productOptions: this.createOptionArray(data.products),
                    storeOptions: this.createOptionArray(data.stores),
                    fields:fields
                });
            }).catch(e=>
                console.log(e)
            );

    }

    componentDidMount() {
        this.getData();
    }


    editHandler = (edittedItem) => {
        const dataSet = this.state.dataSet.map(c => {
            return (c.id === edittedItem.id) ? edittedItem : c;
        });
        this.setState({ dataSet });
    }

    createHandler = (createdItem) => {//createdItem from the server
        this.setState({ dataSet: [...this.state.dataSet, createdItem ]})
       
    }

    deleteHandler = (id) => {
        const dataSet = this.state.dataSet.filter(c => c.id !== id);
        this.setState({ dataSet });
    }

    renderDataTable(dataSet, fields) {
        if (fields.length > 0) {
            return (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            {fields.map(fieldName => {
                                if (!fieldName.includes("Id") && fieldName !== "sale" && fieldName !== "id")
                                    return (<Table.HeaderCell key={`${this.props.model}-${fieldName}`}> {Capitalize(fieldName)}</Table.HeaderCell>)
                            })}

                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            dataSet.map(item => {
                                if (item.customer != null)
                                    return (
                                        <Table.Row key={item.id}>
                                            <Table.Cell>{new Date(item.dateSold).toDateString}</Table.Cell>
                                            <Table.Cell>{item.customer.name}</Table.Cell>
                                            <Table.Cell>{item.product.name}</Table.Cell>
                                            <Table.Cell> {item.store.name}</Table.Cell>
                                            <Table.Cell>
                                                <SaleForm
                                                    editHandler={this.editHandler}
                                                    model={this.props.model}
                                                    isEdit={true}
                                                    item={this.state.dataSet[0]}
                                                    customerOptions={this.state.customerOptions}
                                                    productOptions={this.state.productOptions}
                                                    storeOptions={this.state.storeOptions}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <DeleteConfirm item={item} model={this.props.model} deleteHandler={this.deleteHandler} />
                                            </Table.Cell>
                                        </Table.Row>

                                    )
                            })
                        }
                    </Table.Body>

                </Table>
            );
        }
    }

    render() {
        return (
            <div>
                {this.state.dataSet.length > 0
                    ? <SaleForm
                        createHandler={this.createHandler}
                        model={this.props.model}
                        isEdit={false}
                        item={this.state.dataSet[0]}
                        customerOptions={this.state.customerOptions}
                        productOptions={this.state.productOptions}
                        storeOptions={this.state.storeOptions}

                    />
            : null}
                {this.renderDataTable(this.state.dataSet, this.state.fields)}
            </div>
        );
    }
}


