/* tslint:disable */
/* I DON'T KNOW HOW TO GET THE SERVICE GRAPH PAGE FROM WRAPPER NOW THAT WE NEED PROVIDER AT THE ROOT */

import * as React from 'react';
import { shallow } from 'enzyme';

import { GraphParamsType } from '../../../types/Graph';
import { Duration, Layout, BadgeStatus } from '../../../types/GraphFilter';
import Namespace from '../../../types/Namespace';

import ServiceGraphPage from '../ServiceGraphPage';
import store from '../../../store/ConfigStore';
import { Provider } from 'react-redux';

const PARAMS: GraphParamsType = {
  namespace: { name: 'itsio-system' },
  graphDuration: { value: 60 },
  graphLayout: { name: 'Cose' },
  badgeStatus: { hideCBs: true, hideRRs: true }
};
describe('ServiceGraphPage test', () => {
  it('should propagate filter params change with correct value', () => {
    const onParamsChangeFn = jest.fn();
    const wrapper = shallow(
      <Provider store={store}>
        <ServiceGraphPage {...PARAMS} onParamsChange={onParamsChangeFn} />
      </Provider>
    );

    const serviceGraph = wrapper.childAt(0) as ServiceGraphPage; // TODO
    const newLayout: Layout = { name: 'Cola' };
    serviceGraph.handleLayoutChange(newLayout); // simulate layout change
    const EXPECT1 = Object.assign({}, PARAMS, { graphLayout: newLayout });
    expect(onParamsChangeFn).toHaveBeenLastCalledWith(EXPECT1);

    const newDuration: Duration = { value: 1800 };
    serviceGraph.handleFilterChange(newDuration); // simulate duration change
    const EXPECT2 = Object.assign({}, PARAMS, { graphDuration: newDuration });
    expect(onParamsChangeFn).toHaveBeenLastCalledWith(EXPECT2);

    const newNamespace: Namespace = { name: 'bookinfo' };
    serviceGraph.handleNamespaceChange(newNamespace); // simulate name change
    const EXPECT3 = Object.assign({}, PARAMS, { namespace: newNamespace });
    expect(onParamsChangeFn).toHaveBeenLastCalledWith(EXPECT3);

    const badgeStatus: BadgeStatus = { hideCBs: false, hideRRs: false };
    serviceGraph.handleBadgeStatusChange(badgeStatus); // simulate 'show Circuit breaker' status change
    const EXPECT4 = Object.assign({}, PARAMS, { badgeStatus: badgeStatus });
    expect(onParamsChangeFn).toHaveBeenLastCalledWith(EXPECT4);
  });
});

/* */
