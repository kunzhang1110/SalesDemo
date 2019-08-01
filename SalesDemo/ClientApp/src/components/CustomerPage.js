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

    submitHandler = (e, customer, isEdit) => {
        if (isEdit) {
            axios.put('/api/Customer/' + customer.id, {
                name: customer.name,
                address: customer.address
            }).then(resp => { })

        }

        //axios.post('/api/Customer', {
        //    name: this.state.customer.name,
        //    address: this.state.customer.address
        //}).then((res) => {
        //    this.handleClose();
        //})
    }

    changeHandler = (id, e, { name, value }) => {
        const customers = [...this.state.customers]
        const idx = customers.findIndex(c => c.id == id);
        customers[idx] = { ...customers[idx], [name]: value }
        this.setState({ customers})
    }

    renderCustomerTable(customers) {
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
                                    <CustomerForm  customer={c} submitHandler={this.submitHandler}/>
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
                {this.renderCustomerTable(this.state.customers)}
            </div>
        );
    }
}
