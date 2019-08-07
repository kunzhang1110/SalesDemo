import React, { Component } from 'react';
import _ from 'lodash'
import { Dropdown, Container, Table, Pagination } from 'semantic-ui-react';
import { ModelForm } from './ModelForm';
import { DeleteConfirm } from './DeleteConfirm';
import PropTypes from "prop-types";
import { Capitalize } from '../utils'

export class ModelPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSet: [],
            fields: [],
            column: null,
            direction: null,
            numberOfRow: 5,
            currentPage: 1,
        };
    }

    numberOfRowOptions = [
        { key: 5, text: 5, value: 5 },
        { key: 10, text: 10, value: 10 },
        { key: 15, text: 15, value: 15 },
    ];

    getData = () => {
        fetch('/api/' + this.props.model)
            .then(
                response => response.json())
            .then(data => {
                var fields = Object.keys(data[0]);
                this.setState({ dataSet: data, fields: fields });
            });

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

    createHandler = (createdItem) => {
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
            <Table sortable celled fixed>
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
                            return null;
                        })}

                        <Table.HeaderCell>Edit</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        dataSet.map(item => {
                            if (item.name != null)
                                return (
                                    <Table.Row key={item.id}>
                                        {Object.keys(item).map((k) => {
                                            if (k !== "id" && k !== "sale")
                                                return (
                                                    <Table.Cell key={`${this.props.model}-${item.id}-${k}`}>{item[k]}</Table.Cell>
                                                )
                                            return null;
                                        })}
                                        
                                        <Table.Cell>
                                            <ModelForm item={item} editHandler={this.editHandler} model={this.props.model} isEdit={true} />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DeleteConfirm item={item} model={this.props.model} deleteHandler={this.deleteHandler} />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            return null;
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
                <Container >
                    <ModelForm createHandler={this.createHandler} model={this.props.model} isEdit={false} item={this.state.dataSet[0]} />
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

ModelPage.propTypes = {
    model: PropTypes.string
}
