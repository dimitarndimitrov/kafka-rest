import encoding from "k6/encoding";

import {randomIntBetween, randomItem, uuidv4} from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

import {produceBinaryToTopic, randomByteString} from "./common.js";
import {createTopic, deleteTopic, listTopics, listClusters} from "../v3/common.js";

export let options = {
    stages: [
        {duration: '10s', target: 2000},
        {duration: '180s', target: 2000},
        {duration: '10s', target: 0},
    ],
    setupTimeout: '1m',
    teardownTimeout: '1m'
};

export function setup() {
    let clusterId = "lkc-nvx9wd";
//    let listClustersResponse = listClusters();
//    let clusterId = randomItem(listClustersResponse.json().data).attributes.cluster_id;

    let topics = ["topic-binary-ff6cf3e6-94e2-47b7-bfa4-069ad89c516f"];
    // Uncomment the commented-out section below to create a topic to be used for produce and
    // consume tests and write down the topic name, then hardcode it above in the topics array and
    // comment the section below again. Then stop Kafka REST, start this test, and start again
    // Kafka REST to have it initialize while a significant load is being sent its way.
//    let topics = [];
//    for (let i = 0; i < 10; i++) {
//        let topicName = topics[i];
//        let topicName = `topic-binary-${uuidv4()}`;
//        topics.push(topicName);
//        createTopic(clusterId, topicName, 3, 3);
//    }

    return {topics};
}

export default function (data) {
    let records = [];
    for (let i = 0; i < randomIntBetween(1, 100); i++) {
        records.push({
            key: encoding.b64encode(randomByteString(randomIntBetween(1, 1025))),
            value: encoding.b64encode(randomByteString(randomIntBetween(1, 4097)))
        });
    }

    produceBinaryToTopic(randomItem(data.topics), records);
}

export function teardown(data) {
// Don't delete topics. Use the produced messages on consume-binary-test.
// If you do want to delete the test topics created so far, uncomment the code below:
//
//    let listClustersResponse = listClusters();
//    let clusterId = randomItem(listClustersResponse.json().data).attributes.cluster_id;
//
//    let listTopicsResponse = listTopics(clusterId);
//    listTopicsResponse.json().data
//        .filter(topic => topic.attributes.topic_name.startsWith('topic-binary-'))
//        .map(topic => deleteTopic(clusterId, topic.attributes.topic_name));
}
