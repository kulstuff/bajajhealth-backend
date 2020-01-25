const Axios = require('axios')

startMillis = 1546281000000
stride = 86400000 * 30

async function getSource (dataSource) {
    console.log(dataSource)
    for(var i = startMillis; i < (1579853055036 + stride); i += stride) {
        await Axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            "aggregateBy": [{
            "dataSourceId":
                dataSource
            }],
            "bucketByTime": { "durationMillis": 86400000 },
            "startTimeMillis": i,
            "endTimeMillis": i + stride
        }, {
            headers: {
                'Authorization': 'Bearer ya29.ImC7BxgME0ChpIAdseHTXQk8RU0qg8PxTOj0INaLqNR33eAthkC2V2ICMZm7qRf9kikgjVgbrNOSvFENChBiigIyx2MIuhRaCsPJnmAkqX2sGf4MaOs0leiksywxodaLsOY'
            }, 
        }).then(res => {
            var bucketSize = res.data.bucket.length
            for( var j = 0; j < bucketSize; j++) {
                if(res.data.bucket[j].dataset[0].point.length > 0)  {
                    console.log(new Date(res.data.bucket[j].dataset[0].point[0].startTimeNanos / 1000000))
                    console.log(res.data.bucket[j].dataset[0].point[0].value)
                    // console.log(new Date(i))
                }
            }
        }).catch(err => {
            console.log(err)
        })
    }
}

run()

async function run () {
    await Axios.get('https://www.googleapis.com/fitness/v1/users/me/dataSources', {
            headers: {
                'Authorization': 'Bearer ya29.ImC7BxgME0ChpIAdseHTXQk8RU0qg8PxTOj0INaLqNR33eAthkC2V2ICMZm7qRf9kikgjVgbrNOSvFENChBiigIyx2MIuhRaCsPJnmAkqX2sGf4MaOs0leiksywxodaLsOY'
            }, 
        }).then(async res => {
            const sizeOfDataSources = res.data.dataSource.length
            const dataSources = res.data.dataSource
            for(var i = 0; i < sizeOfDataSources; i++) {
                if(dataSources[i].dataStreamId.includes('derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'))
                // if(dataSources[i].dataStreamId.includes('raw:com.google.height:com.healthifyme.basic'))
                    // console.log(dataSources[i].dataStreamId)
                    await getSource(dataSources[i].dataStreamId)
            }
        }).catch(err => {
            console.log(err)
        })
}
