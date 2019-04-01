import CommonFunc from './CommonFunc';
export default class harga extends CommonFunc{
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
        startkey: 'harga',
        endkey: 'harga\ufff0',
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

  loadAllHarga = () => {
    return new Promise((resolve, reject) => {
      this.db.allDocs({
        startkey: 'harga',
        endkey: 'harga\ufff0',
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

  loadHargaById = (kodeHarga) =>{
    return new Promise((resolve,reject)=> {
      this.db.get(kodeHarga).then(resp => {
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

  simpanHarga = (kodeHarga,namaHarga) => {
    return new Promise(async (resolve,reject)=> {
      let doc;
      try{
         doc = await this.db.get(kodeHarga);
      }catch(err){
        doc = null;
      }
      if(doc !== null){
        this.db.put({
          _id:kodeHarga,
          _rev: doc._rev,
          namaHarga:namaHarga
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
          _id:kodeHarga,
          namaHarga:namaHarga
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