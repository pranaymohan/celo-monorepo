import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'cross-fetch'
import gql from 'graphql-tag'
import getConfig from 'next/config'
import * as React from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import ValidatorsList from 'src/dev/ValidatorsList'
import LeaderBoardError from 'src/dev/LeaderBoardError'
import { I18nProps, withNamespaces } from 'src/i18n'

function createApolloClient() {
  return new ApolloClient({
    // uri: getConfig().publicRuntimeConfig.LEADERBOARD.uri,
    uri: 'http://176.9.9.249:4000/graphiql',
    cache: new InMemoryCache(),
    fetch,
  })
}

const query = gql`
  query ValidatorGroups {
    celoValidatorGroups {
      account(first: 1) {
        edges {
          node {
            accountType
            address
            attestationsFulfilled
            attestationsRequested
            lockedGold
            name
            nonvotingLockedGold
            url
          }
        }
      }
      affiliates(first: 10) {
        edges {
          node {
            address
            groupAddressHash
            member
            score
            signerAddressHash
          }
        }
      }
    }
  }
`

class ValidatorsListApp extends React.PureComponent<I18nProps> {
  render() {
    if (!getConfig().publicRuntimeConfig.FLAGS.LEADERBOARD) {
      return null
    }
    return (
      <ApolloProvider client={createApolloClient()}>
        <Query query={query}>
          {({ loading, error, data }) => {
            if (error) {
              return <LeaderBoardError error={error} />
            }
            const validatorsData = loading ? undefined : data.celoValidatorGroups
            return <ValidatorsList validatorsData={validatorsData} isLoading={loading} />
          }}
        </Query>
      </ApolloProvider>
    )
  }
}

export default withNamespaces('dev')(ValidatorsListApp)
