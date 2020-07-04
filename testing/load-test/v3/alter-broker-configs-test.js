import {sleep} from "k6";

import {randomItem} from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

import {alterBrokerConfigs, listBrokers, listClusters} from './common.js'

export let options = {
    stages: [
        {duration: '10s', target: 100},
        {duration: '40s', target: 100},
        {duration: '10s', target: 0},
    ],
};

export function setup() {
    let listClustersResponse = listClusters();
    let clusterId = randomItem(listClustersResponse.json().data).cluster_id;
    let listBrokersResponse = listBrokers(clusterId);

    return {
        clusterId,
        brokers: listBrokersResponse.json().data.map(broker => broker.broker_id)
    };
}

export default function (data) {
    alterBrokerConfigs(
        data.clusterId,
        randomItem(data.brokers),
        {
            data: [
                {
                    name: 'compression.type',
                    value: 'gzip'
                },
                {
                    name: 'max.connections',
                    operation: 'DELETE'
                }
            ]
        });

    sleep(1);
}

export function teardown(data) {
}
