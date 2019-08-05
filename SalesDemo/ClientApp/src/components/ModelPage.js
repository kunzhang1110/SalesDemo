import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { ModelForm } from './ModelForm';
import { DeleteConfirm } from './DeleteConfirm';
import PropTypes from "prop-types";
import { Capitalize} from '../utils'

export class ModelPage extends Component {

    constructor(props) {
        super(props);
        this.state = { dataSet: [] , fields:[]};
    }

    getData = () => {
        fetch('/api/' + this.props.model)
            .then(
                response => response.json())
            .then(data => {
                var fields = Object.keys(data[0]);
                this.setState({ dataSet: data , fields:fields});
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

    renderDataTable(dataSet, fields) {
        if (fields.length > 0 ) {
            return (
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            {fields.map(fieldName => {
                                if (!fieldName.includes("Id") && fieldName !== "sale" && fieldName!=="id")
                                    return (<Table.HeaderCell key={`${this.props.model}-${fieldName}`}> { Capitalize(fieldName) }</Table.HeaderCell>)
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
                                        {Object.keys(item).map(k => {
                                            if(k!=="id" && k!=="sale")
                                            return (
                                                <Table.Cell key={`${this.props.model}-${item.id}-${k}`}>{item[k]}</Table.Cell>
                                            )
                                        })
                                        }
                                        <Table.Cell>
                                            <ModelForm item={item} editHandler={this.editHandler} model={this.props.model} isEdit={true} />
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
        //{ console.log(this.state.dataSet); debugger;}
        return (
            <div>
                {this.state.fields.length > 0 ? <ModelForm createHandler={this.createHandler} model={this.props.model} isEdit={false} item={this.state.dataSet[0]} /> : null}
                {this.renderDataTable(this.state.dataSet, this.state.fields)}
            </div>
        );
    }
}

ModelPage.propTypes = {
    model: PropTypes.string
}
