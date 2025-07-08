module.exports = {
  configs: {
    recommended: {
      rules: {
        'start-event-required': 'error',
        'end-event-required': 'error',
        'no-disconnected': 'error',
      }
    },
    // all: {
    //   rules: {
    //     'oplus-flow/target-namespace': 'error',
    //     'oplus-flow/no-manual-task': 'warn',
    //     'oplus-flow/conditional-flows': 'error',
    //     'oplus-flow/end-event-required': 'error',
    //     'oplus-flow/event-sub-process-typed-start-event': 'error',
    //     'oplus-flow/fake-join': 'error',
    //     'oplus-flow/label-required': 'error',
    //     'oplus-flow/no-complex-gateway': 'error',
    //     'oplus-flow/no-disconnected': 'error',
    //     // 'oplus-flow/no-node-users': 'error',
    //     'oplus-flow/opflow-jobtask-required': 'error',

    //     // "oplus-flow/oplus-flow/no-duplicate-sequence-flows": "error",
    //     'oplus-flow/no-gateway-join-fork': 'error',
    //     'oplus-flow/no-implicit-split': 'error',
    //     'oplus-flow/no-inclusive-gateway': 'error',
    //     'oplus-flow/single-blank-start-event': 'error',
    //     'oplus-flow/single-event-definition': 'error',
    //     'oplus-flow/start-event-required': 'error',
    //     'oplus-flow/sub-process-blank-start-event': 'error'

    //   }
    // }
  }
}
