import { OptionType } from '../../lib/flags.ts';

export const flags = [ {
    name: 'help',
    aliases: [ 'h' ],
    args: [],
    type: OptionType.BOOLEAN,
    optionalValue: true,
    standalone: true
}, {
    name: 'ext',
    aliases: [ 'e' ],
    args: [],
    type: OptionType.BOOLEAN
}, {
    name: 'all',
    aliases: [ 'a' ],
    args: [],
    type: OptionType.BOOLEAN,
    optionalValue: false
}, {
    name: 'type',
    aliases: [ 't' ],
    type: OptionType.STRING,
    required: true,
    conflicts: [ 'video-type', 'audio-type', 'image-type' ]
}, {
    name: 'video-type',
    aliases: [ 'v' ],
    type: OptionType.STRING,
    required: true,
    requires: [ 'audio-type', 'image-type' ],
    conflicts: [ 'type' ]
}, {
    name: 'audio-type',
    aliases: [ 'a' ],
    type: OptionType.STRING,
    required: true,
    requires: [ 'video-type', 'image-type' ],
    conflicts: [ 'type' ]
}, {
    name: 'image-type',
    aliases: [ 'a' ],
    type: OptionType.STRING,
    required: true,
    requires: [ 'video-type', 'audio-type' ],
    conflicts: [ 'type' ]
}, {
    name: 'amount',
    aliases: [ 'n' ],
    type: OptionType.NUMBER
}, {
    name: 'files',
    aliases: [ 'f' ],
    type: OptionType.STRING,
    variadic: true
}, {
    name: 'multi',
    aliases: [ 'm' ],
    args: [ {
        type: OptionType.NUMBER,
        optionalValue: true
    }, {
        type: OptionType.STRING,
        optionalValue: true,
        variadic: false
    }, {
        type: OptionType.BOOLEAN,
        variadic: true
    } ]
} ];

export const options = {
    stopEarly: false,
    allowEmpty: false,
    types: {},
    flags
};
