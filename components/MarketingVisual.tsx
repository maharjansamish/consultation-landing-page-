import { Icon } from "@/components/Icons";

export function MarketingVisual() {
  return (
    <div className="visual-wrap" aria-label="Illustration of a connected digital marketing workflow">
      <div className="visual-glow visual-glow-cyan" />
      <div className="visual-glow visual-glow-purple" />
      <div className="workflow-panel">
        <div className="panel-topline">
          <div className="panel-dots" aria-hidden="true"><i /><i /><i /></div>
          <span>YOUR MARKETING WORKSPACE</span>
          <span className="panel-live"><i /> CONNECTED</span>
        </div>
        <div className="workflow-heading">
          <div>
            <span className="micro-label">A CLEARER WAY FORWARD</span>
            <h2>From scattered ideas<br />to a focused plan.</h2>
          </div>
          <span className="orbit-icon"><Icon name="spark" /></span>
        </div>
        <div className="workflow-grid">
          <div className="workflow-node node-one">
            <span className="node-icon"><Icon name="target" /></span>
            <div><b>Audience signals</b><small>Know who you want to reach</small></div>
            <span className="node-check"><Icon name="check" /></span>
          </div>
          <div className="workflow-node node-two">
            <span className="node-icon node-purple"><Icon name="content" /></span>
            <div><b>Content system</b><small>Ideas with a clear purpose</small></div>
            <span className="node-check"><Icon name="check" /></span>
          </div>
          <div className="workflow-node node-three">
            <span className="node-icon node-pink"><Icon name="layers" /></span>
            <div><b>Campaign focus</b><small>Choose where attention goes</small></div>
            <span className="node-arrow">↗</span>
          </div>
        </div>
        <div className="workflow-footer">
          <div className="footer-orbit"><span /><span /><span /></div>
          <div><b>Practical next steps</b><small>Built around your business</small></div>
          <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        </div>
        <div className="panel-bottomline"><span>STRATEGY</span><span>CONTENT</span><span>GROWTH</span></div>
      </div>
      <div className="floating-note"><span className="float-star">✦</span><span><b>Clarity first</b><small>Marketing with direction</small></span></div>
      <div className="visual-caption"><span className="caption-line" /> A more intentional digital presence</div>
    </div>
  );
}
