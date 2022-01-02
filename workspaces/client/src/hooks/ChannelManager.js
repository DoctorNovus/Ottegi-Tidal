export class ChannelManager {
    static channels = [];

    /**
     * Checks to see if channels have the same values as ChannelManager channels
     * @param {Array} channels Array of channels to check
     */
    static checkChannels(channels) {
        let channies = ChannelManager.channels;

        let checks = 0;
        let val = false;

        for (let chan of channels) {
            if (channies.includes(chan.id))
                channies.splice(channies.indexOf(chan.id), 1);
        }

        if (channies.length == 0) {
            checks++;
            val = true;
        }

        if (!channels.find(c => c.channels && c.channels.length > 0)) {
            checks++;
            val = true;
        }

        if (checks == 0)
            return false;

        return val;
    }


    /**
     * Sorts and constructs the proper client format for channels and categories
     * @param {Array} chans Channels used to construct
     */
    static sortChannels(chans) {
        let channels = [].concat(chans);
        let categories = [{ name: "No Category", id: "uncategorized", channels: [] }].concat(channels.filter(c => c.type == "category").sort((a, b) => a.pos - b.pos));
        let rest = channels.filter(c => c.type != "category").sort((a, b) => a.pos - b.pos);

        let bind = [];

        let channelList = [];

        for (let category of categories) {
            bind.push(category)
        };

        for (let chan of rest) {
            let b = bind.find(c => c.id == chan.category);
            if (b) {
                if (!b.channels)
                    b.channels = [];

                b.channels.push(chan);
                channelList.push(chan.id);
            }
        }

        ChannelManager.channels = categories.map(c => c.id).concat(channelList);
        bind.checked = true;
        ChannelManager.oldBind = bind;

        return bind;
    }
}