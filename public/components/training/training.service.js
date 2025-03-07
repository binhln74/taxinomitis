(function () {

    angular
        .module('app')
        .service('trainingService', trainingService);

    trainingService.$inject = [
        '$q', '$http'
    ];

    function trainingService($q, $http) {


        function newTrainingData(projectid, userid, tenant, data, label) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/training';

            return $http.post(url, { data : data, label : label })
                .then(function (resp) {
                    return resp.data;
                });
        }

        function deleteTrainingData(projectid, userid, tenant, trainingdataid) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/training/' + trainingdataid;

            return $http.delete(url);
        }

        function getTraining(projectid, userid, tenant) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/training';

            return $http.get(url, { headers : { Range : 'items=0-3000' } })
                .then(function (resp) {
                    return resp.data;
                });
        }

        function getSoundData(soundobj) {
            return $http.get(soundobj.audiourl)
                .then(function (resp) {
                    soundobj.audiodata = resp.data;
                    return soundobj;
                });
        }

        function getModels(projectid, userid, tenant) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/models';

            return $http.get(url).then(function (resp) {
                var models = resp.data;
                if (models) {
                    var now = new Date();
                    for (var i = 0; i < models.length; i++) {
                        models[i].lastPollTime = now;
                    }
                }
                return models;
            });
        }

        function newModel(projectid, userid, tenant) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/models';

            return $http.post(url, {}, { timeout : 180000 }).then(function (resp) {
                resp.data.lastPollTime = new Date();
                return resp.data;
            });
        }

        function testModel(projectid, projecttype, userid, tenant, modelid, credsid, testdata) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/models/' + modelid +
                        '/label';
            testdata.credentialsid = credsid;

            return $http.post(url, testdata)
                .then(function (resp) {
                    return resp.data;
                });
        }

        function deleteModel(projectid, userid, tenant, modelid) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/models/' + modelid;

            return $http.delete(url);
        }


        function uploadImage(projectid, userid, tenant, imgdata, label) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/images';

            var data = new FormData();
            data.append('image', imgdata, 'webcam.jpg');
            data.append('label', label);

            var postreq = {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            };

            return $http.post(url, data, postreq)
                .then(function (resp) {
                    return resp.data;
                });
        }

        function uploadSound(projectid, userid, tenant, audiodata, label) {
            var url = '/api/classes/' + tenant +
                        '/students/' + userid +
                        '/projects/' + projectid +
                        '/sounds';

            return $http.post(url, { data : audiodata, label : label })
                .then(function (resp) {
                    return resp.data;
                });
        }



        function getUnmanagedClassifiers(tenant) {
            var url = '/api/classes/' + tenant + '/classifiers';

            return $http.get(url, { params : { type : 'unmanaged' } })
                .then(function (resp) {
                    return resp.data;
                });
        }

        function deleteBluemixClassifier(tenant, classifierid, credentialsid, type) {
            var url = '/api/classes/' + tenant + '/classifiers/' + classifierid;

            return $http.delete(url, {
                params : {
                    type : type,
                    credentialsid : credentialsid
                }
            });
        }


        return {
            newTrainingData : newTrainingData,
            uploadImage : uploadImage,

            uploadSound : uploadSound,
            getSoundData : getSoundData,

            getTraining : getTraining,
            deleteTrainingData : deleteTrainingData,
            getModels : getModels,
            newModel : newModel,
            testModel : testModel,
            deleteModel : deleteModel,

            getUnmanagedClassifiers : getUnmanagedClassifiers,
            deleteBluemixClassifier : deleteBluemixClassifier
        };
    }
})();
