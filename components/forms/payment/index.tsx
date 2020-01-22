import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { cardName, cardNumber, cvv, expDate } from 'validations';

type PaymentMethod = {
  cardName: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
};
type PaymentFormProps = {
  defaultPaymentMethod?: PaymentMethod;
  savePaymentMethod?: boolean;
  onSubmit: (
    body: PaymentMethod,
    savePaymentMethod: boolean,
  ) => Promise<void> | void;
};

const validations = { cardName, cardNumber, expDate, cvv };
const PaymentForm: React.FC<PaymentFormProps> = props => {
  const { register, handleSubmit, errors } = useForm<PaymentMethod>();
  const [savePayment, setSavePayment] = useState(props.savePaymentMethod);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid
        container
        spacing={3}
        component="form"
        onSubmit={handleSubmit(paymentMethod => {
          props.onSubmit(paymentMethod, savePayment);
        })}
        noValidate
      >
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            name="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            defaultValue={props.defaultPaymentMethod?.cardName}
            inputRef={register(validations.cardName)}
            error={!!errors.cardName}
            helperText={errors.cardName?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            name="cardNumber"
            label="Card number"
            autoComplete="cc-number"
            defaultValue={props.defaultPaymentMethod?.cardNumber}
            inputRef={register(validations.cardNumber)}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber?.message}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            name="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            defaultValue={props.defaultPaymentMethod?.expDate}
            inputRef={register(validations.expDate)}
            error={!!errors.expDate}
            helperText={errors.expDate?.message || 'Date format MM/YYYY'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            type="number"
            id="cvv"
            name="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            defaultValue={props.defaultPaymentMethod?.cvv}
            inputRef={register(validations.cvv)}
            error={!!errors.cvv}
            helperText={
              errors.cvv?.message || 'Last three digits on signature strip'
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                name="saveCard"
                value="yes"
                checked={savePayment}
                onChange={event => setSavePayment(event.target.checked)}
              />
            }
            label="Remember credit card details for next time"
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

export default PaymentForm;
