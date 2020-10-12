import React from 'react';
import PropTypes from 'prop-types';

import { translate } from '@gqlapp/i18n-client-react';
import { PageLayout, Card, CardGroup, Icon, CardTitle, CardText, Underline, MetaTags } from '@gqlapp/look-client-react';
import settings from '@gqlapp/config';

import RegisterForm from './RegisterForm';

const RegisterView = ({ t, onSubmit, isRegistered }) => {
  const renderConfirmationModal = () => (
    <Card>
      <CardGroup style={{ textAlign: 'center' }}>
        <CardTitle>{t('reg.confirmationMsgTitle')}</CardTitle>
        <CardText>{t('reg.confirmationMsgBody')}</CardText>
      </CardGroup>
    </Card>
  );

  const renderContent = () => (
    <Card className="form-card">
      <Underline>
        <CardTitle>
          <Icon type="user-add" /> {t('reg.form.title')}
        </CardTitle>
      </Underline>
      {isRegistered && settings.auth.password.requireEmailConfirmation ? (
        renderConfirmationModal()
      ) : (
        <RegisterForm onSubmit={onSubmit} />
      )}
    </Card>
  );

  return (
    <PageLayout type="forms">
      <MetaTags title={t('reg.title')} description={t('reg.meta')} />

      {renderContent()}
    </PageLayout>
  );
};

RegisterView.propTypes = {
  t: PropTypes.func,
  onSubmit: PropTypes.func,
  isRegistered: PropTypes.bool
};

export default translate('user')(RegisterView);
