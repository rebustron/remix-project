// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { EnvironmentProps, Provider } from '../types'
import { Dropdown } from 'react-bootstrap'
import { CustomMenu, CustomToggle, CustomTooltip } from '@remix-ui/helper'

export function EnvironmentUI(props: EnvironmentProps) {

  Object.entries(props.providers.providerList.filter((provider) => { return provider.isVM }))
  Object.entries(props.providers.providerList.filter((provider) => { return provider.isInjected }))
  Object.entries(props.providers.providerList.filter((provider) => { return !(provider.isVM || provider.isInjected) }))

  const handleChangeExEnv = (env: string) => {
    const provider = props.providers.providerList.find((exEnv) => exEnv.name === env)
    const context = provider.name
    props.setExecutionContext({ context })
  }

  const currentProvider = props.providers.providerList.find((exEnv) => exEnv.name === props.selectedEnv)
  const bridges = {
    'L2 - Optimism': 'https://app.optimism.io/bridge/deposit',
    'L2 - Arbitrum': 'https://bridge.arbitrum.io/'
  }

  const isL2 = (providerDisplayName: string) => providerDisplayName && (providerDisplayName.startsWith('L2 - Optimism') || providerDisplayName.startsWith('L2 - Arbitrum'))
  return (
    <div className="udapp_crow">
      <label id="selectExEnv" className="udapp_settingsLabel">
        <FormattedMessage id="udapp.environment" />
        <CustomTooltip placement={'auto-end'} tooltipClasses="text-nowrap" tooltipId="info-recorder" tooltipText={<FormattedMessage id="udapp.tooltipText2" />}>
          <a href="https://chainlist.org/" target="_blank">
            <i className={'ml-2 fas fa-plug'} aria-hidden="true"></i>
          </a>
        </CustomTooltip>
        <CustomTooltip placement={'auto-end'} tooltipClasses="text-wrap" tooltipId="runAndDeployAddresstooltip" tooltipText={<FormattedMessage id="udapp.environmentDocs" />}>
          <a href="https://remix-ide.readthedocs.io/en/latest/run.html#environment" target="_blank" rel="noreferrer">
            <i className="udapp_infoDeployAction ml-2 fas fa-info"></i>
          </a>
        </CustomTooltip>
      </label>
      <div className="udapp_environment" data-id={`selected-provider-${currentProvider && currentProvider.name}`}>
        <Dropdown id="selectExEnvOptions" data-id="settingsSelectEnvOptions" className="udapp_selectExEnvOptions">
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" className="btn btn-light btn-block w-100 d-inline-block border border-dark form-control" icon={null}>
            {isL2(currentProvider && currentProvider.displayName)}
            {currentProvider && currentProvider.displayName}
            {currentProvider && bridges[currentProvider.displayName.substring(0, 13)] && (
              <CustomTooltip placement={'auto-end'} tooltipClasses="text-nowrap" tooltipId="info-recorder" tooltipText={<FormattedMessage id="udapp.tooltipText3" />}>
                <i
                  style={{ fontSize: 'medium' }}
                  className={'ml-2 fa fa-rocket-launch'}
                  aria-hidden="true"
                  onClick={() => {
                    window.open(bridges[currentProvider.displayName.substring(0, 13)], '_blank')
                  }}
                ></i>
              </CustomTooltip>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu as={CustomMenu} className="w-100 custom-dropdown-items" data-id="custom-dropdown-items">
            {props.providers.providerList.length === 0 && <Dropdown.Item>
              <span className="">
                No provider pinned
              </span>
            </Dropdown.Item>}
            { (props.providers.providerList.filter((provider) => { return provider.isInjected })).map(({ name, displayName }) => (
              <Dropdown.Item
                key={name}
                onClick={async () => {
                  handleChangeExEnv(name)
                }}
                data-id={`dropdown-item-${name}`}
              >
                <span className="">
                  {displayName}
                </span>
              </Dropdown.Item>
            ))}
            { props.providers.providerList.filter((provider) => { return provider.isInjected }).length !== 0 && <Dropdown.Divider className='border-secondary'></Dropdown.Divider> }
            { (props.providers.providerList.filter((provider) => { return provider.isVM })).map(({ displayName, name }) => (
              <Dropdown.Item
                key={name}
                onClick={() => {
                  handleChangeExEnv(name)
                }}
                data-id={`dropdown-item-${name}`}
              >
                <span className="">
                  {displayName}
                </span>
              </Dropdown.Item>
            ))}
            { props.providers.providerList.filter((provider) => { return provider.isVM }).length !== 0 && <Dropdown.Divider className='border-secondary'></Dropdown.Divider> }
            { (props.providers.providerList.filter((provider) => { return !(provider.isVM || provider.isInjected) })).map(({ displayName, name }) => (
              <Dropdown.Item
                key={name}
                onClick={() => {
                  handleChangeExEnv(name)
                }}
                data-id={`dropdown-item-${name}`}
              >
                <span className="">
                  {isL2(displayName)}
                  {displayName}
                </span>
              </Dropdown.Item>
            ))}
            <Dropdown.Divider className='border-secondary'></Dropdown.Divider>
            <Dropdown.Item
              key={10000}
              onClick={() => {
                props.setExecutionContext({ context: 'item-another-chain' })
              }}
              data-id={`dropdown-item-another-chain`}
            >
              <span className="">
                Customize this list...
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
