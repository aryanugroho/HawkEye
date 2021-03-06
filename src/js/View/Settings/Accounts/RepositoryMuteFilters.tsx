import * as React from 'react';
import * as get from 'lodash/get';
import { connect } from 'react-redux';
import * as Octicon from 'react-octicon';

import { dispatch } from 'Helpers/State/Store';

import {
  setReasonFilter,
  setSubjectFilter
} from 'Actions/RepositoryMuteFilters';

import {
  gitHubNotificationReasonTypes,
  githubNotificationSubjectTypes,
  gitHubNotificationReasonTypePrettyNames,
  gitHubNotificationSubjectTypePrettyNames
} from 'Constants/Services/GitHub';

import { confirmRemoveRepositoryMuteFilter } from 'Electron/Dialogs/Accounts';

import {
  Btn,
  Scroll,
  Toggle,
  CenteredBox,
} from 'View/Ui/Index';
import ViewBar from 'View/Components/ViewBar/Index';
import GenericError from 'View/Components/GenericError';

interface IAccountRepositoryMuteFilterProps extends ReactRouter.RouteComponentProps<{
                                                      accountId: number;
                                                      repoId: string;
                                                    }, any>
{
  repository: IGitHubRepository;

  repositoryMuteFilter: IStateRepositoryMuteFiltersAccountRepo;
};

class AccountRepositoryMuteFilter extends React.Component<IAccountRepositoryMuteFilterProps, any>
{
  handleReasonChange(reason: string, enabled: boolean)
  {
    dispatch(setReasonFilter(this.props.params.accountId,
                             this.props.params.repoId,
                             reason,
                             enabled));
  }

  handleSubjectChange(subjectType: string, enabled: boolean)
  {
    dispatch(setSubjectFilter(this.props.params.accountId,
                              this.props.params.repoId,
                              subjectType,
                              enabled));
  }

  handleRemoveRepositoryMuteFilter(e)
  {
    e.preventDefault();

    confirmRemoveRepositoryMuteFilter(
      this.props.params.accountId,
      this.props.params.repoId,
      '/settings/accounts/' + this.props.params.accountId
    );
  }

  render()
  {
    let accountSettingsUrl = '/settings/accounts/' + this.props.params.accountId;

    /*
     * If we can't find the repository or mute
     * filter, theres an issue.
     */
    if (typeof this.props.repository === 'undefined'
          || typeof this.props.repositoryMuteFilter === 'undefined') {
      return (
        <ViewBar title="Edit Mute filter"
                backLink={accountSettingsUrl}>
          <GenericError title="Cannot find Repository Mute Filter"
                        description="This Repository Mute Filter was not found."
                        buttonText="Go Back"
                        buttonUrl={accountSettingsUrl} />
        </ViewBar>
      )
    }

    return (
      <ViewBar title={'Edit Mute Filter'}
               backLink={accountSettingsUrl}
               getRightContent={() =>
               (
                 <CenteredBox>
                   <a href="#"
                      className={'view-bar__settings__right-icon '
                                  + 'view-bar__settings__right-icon--delete'}
                      onClick={this.handleRemoveRepositoryMuteFilter.bind(this)}>
                     <Octicon name="x" />
                   </a>
                 </CenteredBox>
               )}>
        <Scroll>
          <div className="grid account-settings-header">
            <div className="grid__item one-quarter mobile-display--hidden"></div>
            <div className="grid__item one-half mobile-one-whole">
              <div className="soft-delta text--center truncate">
                <Octicon name={this.props.repository.private
                                 ? 'lock'
                                 : 'repo'}
                         className={'display--inline position--relative top--nu '
                                      + 'account-settings__repo-icon text--beta'} />
                <p className="account-settings__repo display--inline text--delta push-zeta--left">
                  {this.props.repository.fullName}
                </p>
              </div>
            </div>
          </div>
          <div className="soft-delta">
            <div className="grid">
              <div className="grid__item one-half mobile-one-whole">
                <label className="push-delta--bottom">Reasons</label>
                <div className="grid">
                  {Object.keys(gitHubNotificationReasonTypes)
                         .map(type =>
                         {
                           let t = gitHubNotificationReasonTypes[type];

                           return (
                             <div key={type}
                                  className="grid__item one-whole push-delta--bottom">
                               <label className="text--zeta push-zeta--bottom">
                                 {gitHubNotificationReasonTypePrettyNames[t]}
                               </label>
                               <Toggle options={[{
                                         index : 1,
                                         text  : 'Keep',
                                         value : true
                                       }, {
                                         index : 2,
                                         text  : 'Ignore',
                                         value : false
                                       }]}
                                       value={this.props.repositoryMuteFilter.allowedReasons.indexOf(type) > -1}
                                       onChange={this.handleReasonChange.bind(this, type)} />
                             </div>
                           );
                         })}
                </div>
              </div>
              <div className="grid__item one-half mobile-one-whole">
                <label className="push-delta--bottom">Subject Types</label>
                <div className="grid">
                  {Object.keys(githubNotificationSubjectTypes)
                         .map(type =>
                         {
                           let t = githubNotificationSubjectTypes[type];

                           return (
                             <div key={type}
                                  className="grid__item one-whole push-delta--bottom">
                               <label className="text--zeta push-zeta--bottom">
                                 {gitHubNotificationSubjectTypePrettyNames[t]}
                               </label>
                               <Toggle options={[{
                                         index : 1,
                                         text  : 'Keep',
                                         value : true
                                       }, {
                                         index : 2,
                                         text  : 'Ignore',
                                         value : false
                                       }]}
                                       value={this.props.repositoryMuteFilter.allowedSubjectTypes.indexOf(type) > -1}
                                       onChange={this.handleSubjectChange.bind(this, type)} />
                             </div>
                           );
                         })}
                </div>
              </div>
            </div>
          </div>
        </Scroll>
      </ViewBar>
    );
  }
};

export default connect(
  (state: IState, props: IAccountRepositoryMuteFilterProps) => ({
    repository           : state.repositories[props.params.repoId],
    repositoryMuteFilter : get(state.repositoryMuteFilters,
                               `${props.params.accountId}.${props.params.repoId}`,
                               undefined)
  })
)(AccountRepositoryMuteFilter);