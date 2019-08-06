import React, { Component } from 'react';
import _ from 'lodash'
import { Table, Dropdown } from 'semantic-ui-react';
import { SaleForm } from './SaleForm';
import { DeleteConfirm } from './DeleteConfirm';
import PropTypes from "prop-types";
import { Capitalize, formatDateToString } from "../utils"

export class SalePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSet: [],
            fields: [],
            column: null,
            direction: null
        };
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
                    customers: data.customers,
                    products: data.products,
                    stores: data.stores,
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
        console.log(edittedItem)
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

    sortHandler = (clickedColumn) => () => {
        const { column, dataSet, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                dataSet: _.sortBy(dataSet, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }
        this.setState({
            dataSet: dataSet.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    renderDataTable(dataSet, fields) {
        const { column, direction } = this.state;
        if (fields.length > 0) {
            return (
                <Table celled sortable fixed>
                    <Table.Header>
                        <Table.Row>
                            {fields.map(fieldName => {
                                if (!fieldName.includes("Id") && fieldName !== "sale" && fieldName !== "id")
                                    return (
                                        <Table.HeaderCell
                                            key={`${this.props.model}-${fieldName}`}
                                            sorted={column === fieldName ? direction : null}
                                            onClick={this.sortHandler(fieldName)}>
                                                               {Capitalize(fieldName)}
                                        </Table.HeaderCell>)
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
                                            <Table.Cell>{item.dateSold}</Table.Cell>
                                            <Table.Cell>{this.state.customers.find((e)=>e.id==item.customerId).name}</Table.Cell>
                                            <Table.Cell>{this.state.products.find((e) => e.id == item.productId).name}</Table.Cell>
                                            <Table.Cell> {this.state.stores.find((e) => e.id == item.storeId).name}</Table.Cell>
                                            <Table.Cell>
                                                <SaleForm
                                                    editHandler={this.editHandler}
                                                    model={this.props.model}
                                                    isEdit={true}
                                                    item={item}
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
                {this.state.fields.length > 0
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


