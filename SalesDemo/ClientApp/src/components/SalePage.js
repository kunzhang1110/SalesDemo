import React, { Component } from 'react';
import _ from 'lodash'
import { Container, Pagination, Table, Dropdown } from 'semantic-ui-react';
import { SaleForm } from './SaleForm';
import { DeleteConfirm } from './DeleteConfirm';
import PropTypes from "prop-types";
import { Capitalize, formatDateToString } from "../utils"
import moment from 'moment';

export class SalePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSet: [],
            fields: [],
            column: null,
            direction: null,
            numberOfRow: 5,
            currentPage: 1
        };
    }

    numberOfRowOptions = [
        { key: 5, text: 5, value: 5 },
        { key: 10, text: 10, value: 10 },
        { key: 15, text: 15, value: 15 },
    ];

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
                    fields: fields
                });
            }).catch(e =>
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
        this.setState({ dataSet: [...this.state.dataSet, createdItem] })

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
                                        <Table.Cell>{this.state.customers.find((e) => e.id == item.customerId).name}</Table.Cell>
                                        <Table.Cell>{this.state.products.find((e) => e.id == item.productId).name}</Table.Cell>
                                        <Table.Cell> {this.state.stores.find((e) => e.id == item.storeId).name}</Table.Cell>
                                        <Table.Cell>{moment(item.dateSold, 'MM/DD/YYYY').format("DD MMM, YYYY")}</Table.Cell>
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

    paginationHandler = (e, data) => {
        const currentPage = e.target.getAttribute("value");
        this.setState({ currentPage })
    }

    numberOfRowHandler = (e, { value }) => {
        this.setState({ numberOfRow: value });
    }


    render() {
        if (this.state.fields.length > 0) {
            return (
                <Container>
                    <SaleForm
                        createHandler={this.createHandler}
                        model={this.props.model}
                        isEdit={false}
                        item={this.state.dataSet[0]}
                        customerOptions={this.state.customerOptions}
                        productOptions={this.state.productOptions}
                        storeOptions={this.state.storeOptions}

                    />

                    {this.renderDataTable(
                        this.state.dataSet.slice((this.state.currentPage - 1) * this.state.numberOfRow, this.state.currentPage * this.state.numberOfRow),
                        this.state.fields)
                    }
                    <Dropdown
                        selection
                        compact
                        value={this.state.numberOfRow}
                        onChange={this.numberOfRowHandler}
                        options={this.numberOfRowOptions}
                    />
                    <Pagination
                        defaultActivePage={this.state.currentPage}
                        totalPages={Math.ceil(this.state.dataSet.length / this.state.numberOfRow)}
                        onPageChange={this.paginationHandler}
                        floated='right' />
                </Container>
            );


        } else {
            return <div></div>
        }

    }
}


