import CommonFunc from './CommonFunc';
export default class Wilayah extends CommonFunc{
  offset;
  limit;
  constructor(){
    super();
    this.offset = 0;
    this.limit = 10;
  }

  loadNextPage = () => {
    return new Promise((resolve,reject)=> {
      this.db.allDocs({
        startkey: 'wilayah',
        endkey: 'wilayah\ufff0',
        skip: this.offset * this.limit,
        limit: this.limit,
        include_docs: true
      }).then(resp => {
        this.offset++;
        var data = resp.rows.map(el => el.doc);
        return (
          resolve({
            success:true,
            data,
            isEnd: data.length === 0
          })
        )
      }).catch(err => {
        return(
          reject(err)
        )
      })
    });
  }

  loadAllWilayah = ()=> {
    return new Promise((resolve, reject) => {
      this.db.allDocs({
        startkey: 'wilayah',
        endkey: 'wilayah\ufff0',
        include_docs: true
      }).then(resp => {
        var data = resp.rows.map(el => el.doc);
        return (
          resolve({
            success: true,
            data,
          })
        )
      }).catch(err => {
        return (
          reject(err)
        )
      })
    });
  }

  resetOffset = ()=> {
    this.offset = 0;
  }

  loadWilayahById = (kodeWilayah) =>{
    return new Promise((resolve,reject)=> {
      this.db.get(kodeWilayah).then(resp => {
        return(
          resolve({
            success:true,
            data: resp
          })
        )
      }).catch(err => {
        if(err.status == 404){
          return(
            resolve({
              success:false,
              info:"Data tidak ditemukan"
            })
          )
        }
        return(
          reject(err)
        )
      })
    })
  }

  simpanWilayah = (kodeWilayah,namaWilayah) => {
    return new Promise(async (resolve,reject)=> {
      let doc;
      try{
         doc = await this.db.get(kodeWilayah);
      }catch(err){
        doc = null;
      }
      if(doc !== null){
        this.db.put({
          _id:kodeWilayah,
          _rev: doc._rev,
          namaWilayah:namaWilayah
        }).then(()=> {
          return(
            resolve({
              success:true,
              info:"Data berhasil disimpan"
            })
          )
        }).catch(err=>{
          return(
            reject(err)
          )
        })
      }else{
        this.db.put({
          _id:kodeWilayah,
          namaWilayah:namaWilayah
        }).then(()=> {
          return(
            resolve({
              success:true,
              info:"Data berhasil disimpan"
            })
          )
        }).catch(err=>{
          return(
            reject(err)
          )
        })
      }
    });
  }
}