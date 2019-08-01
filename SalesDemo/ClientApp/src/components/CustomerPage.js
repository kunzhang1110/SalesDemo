import React, { Component } from 'react';
import { Modal, Header, Image, Button, Icon, Label, Menu, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { CustomerForm } from './CustomerForm'
import axios from 'axios'

export class CustomerPage extends Component {

    constructor(props) {
        super(props);
        this.state = { customers: [] };
        this.getCustomers();

    }

    getCustomers = () => {
        fetch('/api/Customer')
            .then(
                response => response.json())
            .then(data => {
                this.setState({ customers: data });
            });
    }

    submitHandler = (e) => {
        axios.post('/api/Customerd', {
            name: this.state.customer.name,
            address: this.state.customer.address
        }).then((res) => {
            console.log(res);
            this.handleClose();
        })
    }

    static renderCustomerTable(customers) {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Adress</Table.HeaderCell>
                        <Table.HeaderCell>Edit</Table.HeaderCell>
                        <Table.HeaderCell>DELETE</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        customers.map(c => (
                            <Table.Row key={c.id}>
                                <Table.Cell>{c.name}</Table.Cell>
                                <Table.Cell>{c.address}</Table.Cell>
                                <Table.Cell>
                                    <CustomerForm customer={c} submitHandler={this.submitHandler} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button >Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>

            </Table>
        );
    }

    render() {
        return (
            <div>
                <CustomerForm />
                {CustomerPage.renderCustomerTable(this.state.customers)}
            </div>
        );
    }
}
