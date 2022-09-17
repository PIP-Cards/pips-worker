# PIPS-Worker

This is a web server worker that is connected to Clourdflare's R2 buckets. It provides web request services for GET requests.

## Uploading Assets

We use Cloudflare's R2 as a centralized storage system in addition to IPFS. IPFS is used to store card images that are associated with the blockchain's smart contract as is the best practice in Web3. IPFS assets are slow to load, so we use R2.

To upload assets:

* Install `rclone`: `brew install rclone`
* Set up a config for Cloudflare:

* Create a API secret and add to the config
* Assuming the namespace in the config is `pips-cf` you can upload images in folders like this:

```sh
rclone copy cohort-1/ pips-cf:decks/awakened-kingdom/
```

This will upload all subdirectories to `decks/awakened-kingdom/`

In addition to the image you must upload the metadata files too:

`rclone copy AwakenedKingdomMetadata/cohort-1/ pips-cf:decks/awakened-kingdom/metadata/`