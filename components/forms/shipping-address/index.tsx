import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { firstName, lastName, address1, city, zip, country } from 'validations';

type ShippingAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
};
type ShippingAddressFormProps = {
  defaultAddress?: ShippingAddress;
  saveAddress?: boolean;
  onSubmit: (
    body: ShippingAddress,
    saveAddress: boolean,
  ) => Promise<void> | void;
};

const validations = {
  firstName,
  lastName,
  address1,
  city,
  zip,
  country,
};

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = props => {
  const { register, handleSubmit, errors } = useForm<ShippingAddress>();
  const [saveAddress, setSaveAddress] = useState(props.saveAddress);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid
        container
        spacing={3}
        component="form"
        onSubmit={handleSubmit(address => {
          props.onSubmit(address, saveAddress);
        })}
        noValidate
      >
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="fname"
            defaultValue={props.defaultAddress?.firstName}
            inputRef={register(validations.firstName)}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="lname"
            defaultValue={props.defaultAddress?.lastName}
            inputRef={register(validations.lastName)}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="billing address-line1"
            defaultValue={props.defaultAddress?.address1}
            inputRef={register(validations.address1)}
            error={!!errors.address1}
            helperText={errors.address1?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="billing address-line2"
            defaultValue={props.defaultAddress?.address2}
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="billing address-level2"
            defaultValue={props.defaultAddress?.city}
            inputRef={register(validations.city)}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            defaultValue={props.defaultAddress?.city}
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="billing postal-code"
            defaultValue={props.defaultAddress?.zip}
            inputRef={register(validations.zip)}
            error={!!errors.zip}
            helperText={errors.zip?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="billing country"
            defaultValue={props.defaultAddress?.country}
            inputRef={register(validations.country)}
            error={!!errors.country}
            helperText={errors.country?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                name="saveAddress"
                value="yes"
                checked={saveAddress}
                onChange={event => {
                  setSaveAddress(event.target.checked);
                }}
              />
            }
            label="Use this address for payment details"
          />
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button variant="contained" color="primary" type="submit">
            Next
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ShippingAddressForm;
