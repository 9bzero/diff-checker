import{useState,useMemo}from'react'
  const DEMO_A="function greet(name) {
  console.log('Hello, ' + name);
  return name;
}"
  const DEMO_B="function greet(name: string): string {
  const msg = `Hello, ${name}!`;
  console.log(msg);
  return msg;
}"
  type DiffLine={type:"add"|"remove"|"equal";text:string}
  function diff(a:string,b:string):DiffLine[]{
    const la=a.split("\n"),lb=b.split("\n")
    const m=la.length,n=lb.length
    const dp:number[][]=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0))
    for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=la[i-1]===lb[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
    const res:DiffLine[]=[]
    let i=m,j=n
    while(i>0||j>0){
      if(i>0&&j>0&&la[i-1]===lb[j-1]){res.unshift({type:"equal",text:la[i-1]});i--;j--}
      else if(j>0&&(i===0||dp[i][j-1]<=dp[i-1][j])){res.unshift({type:"add",text:lb[j-1]});j--}
      else{res.unshift({type:"remove",text:la[i-1]});i--}
    }
    return res
  }
  export default function App(){
    const[left,setLeft]=useState(DEMO_A)
    const[right,setRight]=useState(DEMO_B)
    const lines=useMemo(()=>diff(left,right),[left,right])
    const adds=lines.filter(l=>l.type==="add").length
    const rems=lines.filter(l=>l.type==="remove").length
    const BG={add:"#0c2010",remove:"#200c10",equal:"transparent"}
    const COL={add:"#22c55e",remove:"#ef4444",equal:"#475569"}
    const PFX={add:"+ ",remove:"- ",equal:"  "}
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <h1 style={{fontWeight:800,fontSize:"1.75rem",marginBottom:"0.5rem",color:"#f8fafc"}}>📄 Diff Checker</h1>
          <p style={{color:"#94a3b8",marginBottom:"1.5rem",fontSize:"0.9rem"}}>Paste two texts to see their differences side-by-side</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
            {[{v:left,set:setLeft,label:"Original"},{v:right,set:setRight,label:"Modified"}].map(({v,set,label})=>(
              <div key={label}>
                <div style={{color:"#475569",fontSize:"0.75rem",fontWeight:600,marginBottom:"0.4rem"}}>{label.toUpperCase()}</div>
                <textarea value={v} onChange={e=>set(e.target.value)} rows={8} style={{width:"100%",background:"#111827",border:"1px solid #334155",borderRadius:8,padding:"0.75rem",color:"#e2e8f0",outline:"none",fontFamily:"JetBrains Mono,monospace",fontSize:"0.8rem",resize:"vertical"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:"1rem",marginBottom:"0.75rem",fontSize:"0.82rem"}}>
            <span style={{color:"#22c55e",fontWeight:600}}>+{adds} additions</span>
            <span style={{color:"#ef4444",fontWeight:600}}>-{rems} deletions</span>
            <span style={{color:"#475569"}}>{lines.filter(l=>l.type==="equal").length} unchanged</span>
          </div>
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              {lines.map((line,i)=>(
                <div key={i} style={{display:"flex",background:BG[line.type],borderBottom:"1px solid #0f172a",fontFamily:"JetBrains Mono,monospace",fontSize:"0.8rem",minWidth:"max-content"}}>
                  <div style={{width:36,padding:"0.25rem 0.5rem",color:"#334155",borderRight:"1px solid #1e293b",textAlign:"right",flexShrink:0,fontSize:"0.72rem",userSelect:"none"}}>{i+1}</div>
                  <div style={{padding:"0.25rem 0.75rem",color:COL[line.type],whiteSpace:"pre"}}><span style={{opacity:0.5,marginRight:"0.25rem"}}>{PFX[line.type]}</span>{line.text||" "}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }