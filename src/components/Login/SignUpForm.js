import React, { PureComponent } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'axios';

import Alerts from '../Alerts';
import { saveState, loadState } from '../../helpers/LocalStorage';

export default class SignUpForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      isStoreOwner: false,
      error: {}
    };
  }

  onLoginClick = e => {
    e.preventDefault();
    const { email, phone, name, password, isStoreOwner } = this.state;
    if (email === '' || password === '' || phone === '' || name === '') {
      return this.showError('danger', 'All fields are mandatory. Please try again');
    }

    // make user sign up
    axios
      .post('https://safeslot-backend.herokuapp.com/api/users', {
        email,
        password,
        name,
        phone,
        isStoreOwner
      })
      .then(res => {
        this.props.toggleLogin();
      })
      .catch(err => {
        this.showError('danger', 'Error in signing you up');
      });
  };

  handleChange = e => {
    this.setState(Object.assign({ ...this.state }, {
      [e.target.name]: e.target.name === 'isStoreOwner'? !Boolean(e.target.value) : e.target.value,
      error: {}
    }));
  };

  showError = (type, message) => {
    this.setState(Object.assign({ ...this.state }, { error: { type, message} }));
  };
  closeError = () => {
    this.setState(Object.assign({ ...this.state }, { error: {} }));
  };

  render() {
    const { email, phone, name, password, isStoreOwner } = this.state;
    return (
      <Form>
        <Alerts type={this.state.error.type} message={this.state.error.message} onClose={this.closeError} />

        <FormGroup>
          <Input
            type="text"
            value={name}
            required
            onChange={this.handleChange}
            name="name"
            placeholder="Enter name"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="email"
            value={email}
            required
            onChange={this.handleChange}
            name="email"
            placeholder="Enter Email"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="number"
            value={phone}
            required
            onChange={this.handleChange}
            name="phone"
            placeholder="Enter Contact Number"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            value={password}
            required
            onChange={this.handleChange}
            name="password"
            placeholder="Enter Password"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="checkbox"
            value={isStoreOwner}
            checked={isStoreOwner}
            onChange={this.handleChange}
            name="isStoreOwner"
          />{' '}
          Are you a store owner?
        </FormGroup>

        <p>
          Already have account?{' '}
          <a href="#" onClick={this.props.toggleLogin}>
            Login
          </a>
        </p>
        <Button type="submit" color="info" onClick={this.onLoginClick}>
          SignUp
        </Button>
      </Form>
    );
  }
}
