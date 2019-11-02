JSON.stringify(bcrypt.compare(bcrypt.genSalt(10)
            .then(salt => {
                console.log(`Salt: ${salt}`);
                return bcrypt.hash("sunset", salt);
            })
            .then(hash => {
                console.log(`Hash: ${hash}`);
                return hash;
            }),bcrypt.genSalt(10)
            .then(salt => {
                console.log(`Salt: ${salt}`);
                return bcrypt.hash("sunset", salt);
            })
            .then(hash => {
                console.log(`Hash: ${hash}`);
                return hash;
            }))
        .then(data => {
            console.log("Data: ",data);
            return data;
        }))