import {randomItem, uuidv4} from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

import {consumeBinary, createConsumer, subscribeToTopic} from "./common.js";
import {listClusters, listTopics} from "../v3/common.js";

export let options = {
    stages: [
        {duration: '10s', target: 100},
        {duration: '180s', target: 2000},
        {duration: '10s', target: 0},
    ],
    setupTimeout: '10m',
    teardownTimeout: '1m'
};

export function setup() {
    let clusterId = "lkc-nvx9wd";
//    let listClustersResponse = listClusters();
//    let clusterId = randomItem(listClustersResponse.json().data).attributes.cluster_id;

    let topics = ["topic-binary-ff6cf3e6-94e2-47b7-bfa4-069ad89c516f"];
    // Use the topics/messages from produce-binary-to-topic-test.
//    let listTopicsResponse = listTopics(clusterId);
//    let topics =
//        listTopicsResponse.json().data
//        .filter(topic => topic.attributes.topic_name.startsWith('topic-binary-'))
//        .map(topic => topic.attributes.topic_name)
//        .slice(0, 10);

    let consumerGroupId = "consumer-group-830c72ae-cdc7-4267-aa48-64b7bf4496b3";
    let consumerId = "consumer-04c370df-3154-414d-837c-aaab25a19fb2";
    let consumers = [];
    topics.forEach(
        topicName => {
//            let consumerGroupId = `consumer-group-${uuidv4()}`;
            for (let i = 0; i < 1; i++) {
//                let consumerId = `consumer-${uuidv4()}`;
                consumers.push({consumerGroupId, consumerId});
                // NOTE ddimitrov: The consumer creation and subscription should also be avoidable,
                // although I wasn't able to do that without hitting a number of different errors.
                createConsumer(consumerGroupId, consumerId, 'BINARY');
                subscribeToTopic(consumerGroupId, consumerId, topicName);
            }
        });

    return {clusterId, consumers, topics};
}

export default function (data) {
    let consumer = data.consumers[__VU % data.consumers.length];
    consumeBinary(consumer.consumerGroupId, consumer.consumerId);
}

export function teardown(data) {
    // Shutting down the consumers and deleting the topics doesn't work very well. Just restart the
    // server.
}
