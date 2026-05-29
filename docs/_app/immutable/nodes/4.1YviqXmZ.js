import"../chunks/DsnmJJEf.js";import{al as f,a1 as v,a3 as S,a2 as p,t as z,M as i,an as H,Q as E,aE as ke,am as O,$ as V,a0 as X,a4 as oe,a5 as pe,ba as xe,O as Se}from"../chunks/BFZ9LkA7.js";import{b as u,f as w,c as M,t as Te}from"../chunks/Crl5oi66.js";import{a as A,f as Ce,e as ce}from"../chunks/cK4QeKDK.js";import{e as B,i as U,b as Ae,s as de,c as Me,d as ze}from"../chunks/C-mfHQaF.js";import{e as re}from"../chunks/zvhvVCcK.js";import{c as ne}from"../chunks/CIOv8Qt0.js";import{s as ae,p as G}from"../chunks/C6ZMLTPy.js";import{S as qe,c as Ie}from"../chunks/CV3LEhfm.js";import{i as Z}from"../chunks/BAUbFhtF.js";import{h as W}from"../chunks/B8s1EM68.js";import{s as Re}from"../chunks/i_QrQNzF.js";import{b as De}from"../chunks/B_O0KOv1.js";import"../chunks/DlOzM7pa.js";var he={},K={},ee=34,Q=10,te=13;function me(r){return new Function("d","return {"+r.map(function(t,e){return JSON.stringify(t)+": d["+e+'] || ""'}).join(",")+"}")}function He(r,t){var e=me(r);return function(a,o){return t(e(a),o,r)}}function ue(r){var t=Object.create(null),e=[];return r.forEach(function(a){for(var o in a)o in t||e.push(t[o]=o)}),e}function C(r,t){var e=r+"",a=e.length;return a<t?new Array(t-a+1).join(0)+e:e}function je(r){return r<0?"-"+C(-r,6):r>9999?"+"+C(r,6):C(r,4)}function Ee(r){var t=r.getUTCHours(),e=r.getUTCMinutes(),a=r.getUTCSeconds(),o=r.getUTCMilliseconds();return isNaN(r)?"Invalid Date":je(r.getUTCFullYear())+"-"+C(r.getUTCMonth()+1,2)+"-"+C(r.getUTCDate(),2)+(o?"T"+C(t,2)+":"+C(e,2)+":"+C(a,2)+"."+C(o,3)+"Z":a?"T"+C(t,2)+":"+C(e,2)+":"+C(a,2)+"Z":e||t?"T"+C(t,2)+":"+C(e,2)+"Z":"")}function Be(r){var t=new RegExp('["'+r+`
\r]`),e=r.charCodeAt(0);function a(n,h){var b,y,m=o(n,function(x,k){if(b)return b(x,k-1);y=x,b=h?He(x,h):me(x)});return m.columns=y||[],m}function o(n,h){var b=[],y=n.length,m=0,x=0,k,T=y<=0,q=!1;n.charCodeAt(y-1)===Q&&--y,n.charCodeAt(y-1)===te&&--y;function P(){if(T)return K;if(q)return q=!1,he;var L,F=m,D;if(n.charCodeAt(F)===ee){for(;m++<y&&n.charCodeAt(m)!==ee||n.charCodeAt(++m)===ee;);return(L=m)>=y?T=!0:(D=n.charCodeAt(m++))===Q?q=!0:D===te&&(q=!0,n.charCodeAt(m)===Q&&++m),n.slice(F+1,L-1).replace(/""/g,'"')}for(;m<y;){if((D=n.charCodeAt(L=m++))===Q)q=!0;else if(D===te)q=!0,n.charCodeAt(m)===Q&&++m;else if(D!==e)continue;return n.slice(F,L)}return T=!0,n.slice(F,y)}for(;(k=P())!==K;){for(var j=[];k!==he&&k!==K;)j.push(k),k=P();h&&(j=h(j,x++))==null||b.push(j)}return b}function s(n,h){return n.map(function(b){return h.map(function(y){return l(b[y])}).join(r)})}function d(n,h){return h==null&&(h=ue(n)),[h.map(l).join(r)].concat(s(n,h)).join(`
`)}function _(n,h){return h==null&&(h=ue(n)),s(n,h).join(`
`)}function g(n){return n.map(c).join(`
`)}function c(n){return n.map(l).join(r)}function l(n){return n==null?"":n instanceof Date?Ee(n):t.test(n+="")?'"'+n.replace(/"/g,'""')+'"':n}return{parse:a,parseRows:o,format:d,formatBody:_,formatRows:g,formatRow:c,formatValue:l}}var Ue=Be(","),Pe=Ue.parse,Oe=w('<section id="demo-link"><h2>Link</h2> <p><a href="elements">Default element styles demo</a></p> <p><a href="fonts">Pudding-hosted font previews</a></p> <p><a href="ui">BitsUI styled components</a></p></section>');function We(r){var t=Oe();u(r,t)}var Le=w('<section id="demo-image"><h2>Image</h2> <p>img tag</p> <img src="../assets/demo/test.jpg" alt="cat" class="svelte-b56t42"/> <p>background image</p> <div class="svelte-b56t42"></div></section>');function Fe(r){var t=Le();u(r,t)}var Ne=w('<section id="demo-element"><h2>Dynamic Svelte Element</h2> <!></section>');function Je(r){const t=[{tag:"h3",text:"I am a h3 tag."},{tag:"p",text:"I am p tag."}];var e=Ne(),a=f(v(e),2);B(a,17,()=>t,U,(o,s)=>{let d=()=>i(s).tag,_=()=>i(s).text;var g=M(),c=S(g);re(c,d,!1,(l,n)=>{var h=Te();z(()=>A(h,_())),u(n,h)}),u(o,g)}),p(e),u(r,e)}var Qe=w("<p> </p>");function Ge(r,t){var e=Qe(),a=v(e);p(e),z(()=>A(a,`I am component A and my favorite number is ${t.number??""}.`)),u(r,e)}var $e=w("<p> </p>");function Ye(r,t){var e=$e(),a=v(e);p(e),z(()=>A(a,`I am component B and my name is ${t.name??""}.`)),u(r,e)}var Ze=w('<section id="demo-component"><h2>Dynamic Svelte Component</h2> <!></section>');function Ve(r){const t={A:Ge,B:Ye},e=[{component:"A",number:42},{component:"B",name:"Russell"}];var a=Ze(),o=f(v(a),2);B(o,17,()=>e,U,(s,d)=>{const _=H(()=>t[i(d).component]);var g=M(),c=S(g);ne(c,()=>i(_),(l,n)=>{n(l,ae(()=>i(d)))}),u(s,g)}),p(a),u(r,a)}var Xe=w('<div><p class="svelte-1sxgmm9"> </p></div>'),Ke=w('<section id="scrolly"><h2 class="svelte-1sxgmm9">Scrolly <span> </span></h2> <div class="spacer svelte-1sxgmm9"></div> <!> <div class="spacer svelte-1sxgmm9"></div></section>');function et(r){let t=O(void 0);var e=Ke(),a=v(e),o=f(v(a)),s=v(o,!0);p(o),p(a);var d=f(a,4);qe(d,{get value(){return i(t)},set value(_){E(t,_,!0)},children:(_,g)=>{var c=M(),l=S(c);B(l,16,()=>[0,1,2,3,4],U,(n,h,b)=>{const y=H(()=>i(t)===b);var m=Xe();let x;var k=v(m),T=v(k,!0);p(k),p(m),z(()=>{x=Ae(m,1,"step svelte-1sxgmm9",null,x,{active:i(y)}),A(T,h)}),u(n,m)}),u(_,c)},$$slots:{default:!0}}),ke(2),p(e),z(()=>A(s,i(t)||"-")),u(r,e)}const tt=`{
  "hed": "A love story",
  "story": [
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "addclass": "hide",
      "metric_reverse": "true",
      "text": ""
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "meet",
      "metric_reverse": "true",
      "text": "Once upon a time in the 1960s, an Asian boy and girl met at college. We’ll call them Robert and Linda."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "date",
      "metric_reverse": "true",
      "text": "A few years later, during an unusually rainy season in January, they started dating."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "married",
      "metric_reverse": "true",
      "text": "Then a few years after that, they got married."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "kids",
      "metric_reverse": "true",
      "text": "Eventually they had two kids, bought a single-family home, and built successful careers."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "thumbsup",
      "metric_reverse": "true",
      "text": "Decades later, in 2017, Robert was asked how his relationship is.\\r\\n\\r\\n\\r\\nHe said it was excellent."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "married",
      "metric_reverse": "true",
      "text": "This is the outline of a love story that many of us dream of living. It involves two people who will build a life together—and work through whatever comes their way.\\r\\n\\r\\n\\r\\nAnd something big is about to come their way."
    },
    {
      "chart_title": "Partnership status, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "",
      "metric_reverse": "true",
      "text": "Robert is one of the thousands of adults Stanford University researchers have been [tracking](https://data.stanford.edu/hcmst2017) since 2017.\\r\\n\\r\\n\\r\\nEvery person on this page answered questions about their relationship status, how they met their partner, and how their relationship is going.\\r\\n\\r\\n\\r\\n<div class=smallText>This piece only visualizes people who participated in all three waves of this survey—2017, 2020, and 2022.</div>"
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "Most partnered people said their relationships were <span class=pink>excellent</span> or <span class=purple>good</span>."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppgender",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "Men were more likely to say their relationship was <span class=pink>excellent</span> .\\r\\n\\r\\n\\r\\n>> People reporting excellent relationships, 2017|Relationship happiness by gender|gender2017|How Couples Meet and Stay Together 2017|https://data.stanford.edu/hcmst2017"
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_ppincimp",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "People with more money tended to report <span class=pink>better relationships</span> —partially because they had more time and resources to devote to their partners."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_relate_duration_bucket",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "And to no one’s surprise, couples who had been together longer were more likely to have <span class=pink>high-quality relationships</span>."
    },
    {
      "chart_title": "Quality of relationship, 2017",
      "sort_var": "w1_relate_duration_bucket",
      "metric": "w1_rel_qual_bucket",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "zoom_sprite": "",
      "text": "But a global pandemic is coming in a few years. Could these relationships endure that upheaval?\\r\\n\\r\\n\\r\\nThere were already some signs that modern relationships were heading in the wrong direction.\\r\\n\\r\\n\\r\\nOver the past several generations, a shrinking percentage of people have said their marriage is “very happy.”\\r\\n\\r\\n\\r\\n>> People who say their marriage is “very happy”|Marriage satisfaction data from GSS|marriagesatisfaction|General Social Survey|https://gssdataexplorer.norc.org/trends?category=Gender%20%26%20Marriage&measure=hapmar\\r\\n\\r\\n\\r\\nFrom 1987 to 2013, both [married couples](https://pubmed.ncbi.nlm.nih.gov/36683860/) and [cohabitating partners](https://link.springer.com/article/10.1007/s11113-025-09982-y) reported more unfairness and disagreement. They also said they interacted less with their partners, [possibly](https://www.theatlantic.com/health/archive/2017/09/we-expect-way-too-much-from-our-romantic-partners/541353/) because many Americans are working longer hours to make ends meet.\\r\\n\\r\\n\\r\\n>> Relationship dynamics from 1987 to 2013|Slope charts showing relationship declines|dynamics|Wright, Brown, and Manning (2023) and Wright, Zugarek, Brown, and Manning (2025)|https://link.springer.com/article/10.1007/s11113-025-09982-y|The measures for the marriage and cohabiting studies are slightly different, so the vertical axes show the minimum and maximum for each measure.\\r\\n\\r\\n\\r\\nFurthermore, a record number of people are [not getting married](https://www.pewresearch.org/short-reads/2023/06/28/a-record-high-share-of-40-year-olds-in-the-us-have-never-been-married/). And single people are [less interested](https://www.rasmussenreports.com/public_content/lifestyle/general_lifestyle/june_2025/dating_37_of_young_singles_aren_t_interested) in pursuing relationships compared to prior generations.\\r\\n\\r\\n\\r\\nSo what would a global pandemic do to American relationships? \\r\\n\\r\\n\\r\\nThe obvious theory was that the [stress](https://pubmed.ncbi.nlm.nih.gov/7644604/) caused by the virus and lockdowns would use up the very energy we need to support our partners through it. And because there was no clear end date, the [chronic stress](https://www.sciencedirect.com/science/article/abs/pii/S2352250X16300690) could break some relationships."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "kids",
      "metric_reverse": "true",
      "text": "It’s 2020. People are locked down in their homes. A deadly virus is rapidly spreading around the world.\\r\\n\\r\\n\\r\\nRobert and Linda have agreed that they should socially distance and wear masks in public."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "date",
      "metric_reverse": "true",
      "text": "They haven’t fought much during lockdown. They’ve hunkered down, avoided getting sick, and eventually got the vaccine."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "zoom_id": "524",
      "zoom_label": "",
      "zoom_sprite": "thumbsup",
      "metric_reverse": "true",
      "text": "In fact, Robert says his relationship is still excellent—just like before.\\r\\n\\r\\n\\r\\nNot a huge surprise, given that they’ve been together for more than 50 years!"
    },
    {
      "chart_title": "Partnership status, 2017",
      "sort_var": "w1_partnership_status",
      "metric": "",
      "addclass": "nocolor",
      "metric_reverse": "true",
      "text": "But what happened to everyone else since 2017?"
    },
    {
      "chart_title": "What happened to relationships from 2017 to 2020",
      "sort_var": "w1_partnership_status",
      "metric": "w2_relationship_end",
      "metric_reverse": "",
      "text": "There were more <span class=magenta>divorces</span> and <span class=peach>breakups</span> than normal.\\r\\n\\r\\n\\r\\n>> Breakups and divorces, 2010-13 vs. 2017-20|line chart of breakups|breakups|How Couples Meet and Stay Together 2017|https://data.stanford.edu/hcmst2017",
      "null_value": -1,
      "single_sort_values": [
        3,
        4
      ]
    },
    {
      "chart_title": "How often couples fought in past week, 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_fight_bucket",
      "metric_reverse": "true",
      "text": "Even among people who stayed together, many said they <span class=purple>fought</span> with their partner <span class=peach>multiple</span> times in the past week."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "qual_diff_w1_w2_simple",
      "metric_reverse": "true",
      "text": "In fact, many people rated their relationship <span class=peach>worse</span> in 2020 than three years prior."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_rel_qual_bucket",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "Across human history, we can see how societal disruptions expose the fault lines of our relationships.\\r\\n\\r\\n\\r\\n**For thousands of years**, marriage served mostly a societal function. Aristocrats used it as a tool to consolidate wealth and property across generations. Meanwhile, serfs worked the land for feudal lords, who often controlled their marriages so that couples could be economically viable units.\\r\\n\\r\\n\\r\\n“It was too vital an economic and political institution to be entered into solely on the basis of something as irrational as love,” writes historian Stephanie Coontz in her book, [Marriage, a History](https://www.penguinrandomhouse.com/books/291184/marriage-a-history-by-stephanie-coontz/). \\r\\n\\r\\n\\r\\nBut after the [Black Death](https://www.worldhistory.org/Black_Death/) killed up to half of Europe’s population in the mid-1300s, there was a massive labor shortage and serfs were able to take up trades or jobs that were independent of feudal lords. This meant that there was more freedom and incentive for people to find partners they got along with. “A harmonious, well-functioning marriage was a business necessity as well as a personal pleasure,” Coontz writes.\\r\\n\\r\\n\\r\\n**Eventually in the late-1700s**, people started to marry for love. But that also came with dogmatic beliefs that men and women have innately different natures—that men are better suited to occupy public life, while women are suited to gracefully uphold the veneer of a happy and functional family.\\r\\n\\r\\n\\r\\nThe 1930s, the Great Depression threw a wrench into these expectations. When men lost their jobs, women sought out work.\\r\\n\\r\\n\\r\\n“This threatened the ‘modern’ ideas of masculinity and marriage that most men had come to embrace over the previous two decades,” Coontz writes. “Unemployed men often lost their sense of identity and became demoralized. Many turned to drink. Tempers flared at home.”\\r\\n\\r\\n\\r\\n**Ever since the 1960s**, more people have wanted their relationships to be about self-fulfillment. We want our partners to help us be our best selves, rather than playing a societal role. It has freed us from many traditional and often sexist expectations—but we’re also relying more on our relationships than ever before.\\r\\n\\r\\n\\r\\n“Never before in history had societies thought that such a set of high expectations about marriage was either realistic or desirable,” Coontz writes."
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "So did the high-pressure relationships of modern day really crumble when couples were locked down together?"
    },
    {
      "chart_title": "How relationship quality changed from 2017 to 2020",
      "sort_var": "w2_partner_type",
      "metric": "w2_rel_qual_bucket",
      "metric_reverse": "true",
      "text": "To answer this question, we can’t just ask people to rate their relationship. That’s because once you say it’s <span class=pink>excellent</span>, you can’t go any higher.\\r\\n\\r\\n\\r\\nSo the Stanford researchers asked another question: How did the pandemic change your relationship?"
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_coronavirus_effect_combo",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "It looks like many of these relationships have <span class=pink>improved</span>!"
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "In fact, people in excellent relationships were much more likely to say their relationship got even <span class=pink>better</span>."
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2020",
      "sort_var": "w2_rel_qual_bucket",
      "metric": "w2_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "Meanwhile, the pandemic was far more likely to <span class=peach>erode</span> the quality of less-than-excellent relationships."
    },
    {
      "chart_title": "How the pandemic changed their relationship, 2022",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_coronavirus_effect_combo",
      "metric_reverse": "true",
      "text": "And two years later, these effects were even stronger: More excellent relationships got <span class=pink>better</span>, while fair or worse relationships <span class=peach>suffered</span>."
    },
    {
      "chart_title": "Agreement on safety measures during the pandemic?",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_covid_complete_agree",
      "metric_reverse": "true",
      "text": "One hint as to what’s going on: Couples in excellent relationships were far more likely to have <span class=pink>complete agreement</span> on what safety measures they should follow during the pandemic.\\r\\n\\r\\n\\r\\nA 63-year-old man [told](https://web.stanford.edu/~mrosenfe/Rosenfeld_Hausen_Resilience_Stress_Soc_Sci_2023.pdf) researchers, “We have given up the outside world to keep each other safe. You see, I love [wife’s name] so much.”"
    },
    {
      "chart_title": "Agreement on safety measures during the pandemic?",
      "sort_var": "w3_rel_qual_bucket",
      "metric": "w3_covid_complete_agree",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "So why did a disruption like the pandemic improve strong relationships, while eroding others?\\r\\n\\r\\n\\r\\nStanford researchers studied these relationships and one thing they [found](https://web.stanford.edu/~mrosenfe/Rosenfeld_Hausen_Resilience_Stress_Soc_Sci_2023.pdf) that functional couples engaged in “mutual meaning making.” They were [resilient](https://onlinelibrary.wiley.com/doi/10.1111/j.1545-5300.2003.00001.x) because they aligned their perspectives on the virus’s risk, and agreed on how they would behave in response to it.\\r\\n\\r\\n\\r\\nAnd when they didn’t?\\r\\n\\r\\n\\r\\n“I want to wear a mask, gloves, limit exposure as much as humanly possible, I wipe down surfaces and use hand sanitizer,” a 22-year-old woman told researchers. “He thinks I’m being, in his words, ‘ridiculous and paranoid.’ “\\r\\n\\r\\n\\r\\nThis wasn’t surprising for relationship experts. Psychologist John Gottman observed thousands of couples during his long career, and he created a framework called the “Sounds Relationship House”—basically the infrastructure of successful couples. And at the very top of this house is creating shared meaning. \\r\\n\\r\\n\\r\\n>> The Sound Relationship House|house with labels|gottman|John Gottman|https://www.gottman.com/blog/the-sound-relationship-house-build-love-maps/\\r\\n\\r\\n\\r\\n“I believe that everyone is a philosopher trying to make some sense out of this brief journey we have through life,” Gottman writes in his book, [The Science of Trust](https://wwnorton.com/books/9780393705959). “People do that in many ways, including creating formal and informal rituals of connection, creating shared goals and life missions, supporting each other’s basic roles in life, and agreeing on the meaning of central values and symbols (like ‘what is a home?’).”\\r\\n\\r\\n\\r\\nBut prior societal disruptions revealed cracks in the prevailing relationship models. What did the pandemic expose? Relationship experts have long been anxious that modern relationships require too much of our partners. \\r\\n\\r\\n\\r\\n“Today, we turn to one person to provide what an entire village once did: a sense of grounding, meaning, and continuity,” Esther Perel writes in her book, [Mating in Captivity](https://www.harpercollins.com/products/mating-in-captivity-esther-perel?variant=44338565349410). “Is it any wonder that so many relationships crumble under the weight of it all?”\\r\\n\\r\\n\\r\\nOn one hand, we became free of the institutions and communities that once had power over our relationships—but in turn, they stopped playing a role in our lives."
    },
    {
      "chart_title": "Relationship duration, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "",
      "metric_reverse": "true",
      "text": "We can see our love lives becoming more independent and isolated by looking at how people meet.\\r\\n\\r\\n\\r\\nFirst, let’s group everyone by <span class=white>how long their relationship</span> has been."
    },
    {
      "chart_title": "Met at church, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_q24_church",
      "metric_reverse": "true",
      "text": "In newer relationships, couples rarely <span class=pink>met at church</span>."
    },
    {
      "chart_title": "Met through coworkers, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_met_as_through_cowork",
      "metric_reverse": "true",
      "text": "That rarely <span class=pink>met through coworkers</span>."
    },
    {
      "chart_title": "Met through family, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_met_through_family",
      "metric_reverse": "true",
      "text": "They rarely <span class=pink>met through family members</span>."
    },
    {
      "chart_title": "Met through friends, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_met_through_friend",
      "metric_reverse": "true",
      "text": "And they rarely <span class=pink>met through friends</span>."
    },
    {
      "chart_title": "Met online, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_Q32_simple",
      "metric_reverse": "true",
      "text": "As you already know, the most common way people meet these days is <span class=pink>online</span>, mostly through dating apps.\\r\\n\\r\\n\\r\\n>> How people met|two line charts showing people meet online now|howmeet|How Couples Meet and Stay Together 2017|https://data.stanford.edu/hcmst2017|Five-year rolling averages",
      "null_value": -1,
      "keep_null_sort": true
    },
    {
      "chart_title": "Shared connections, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_no_friend_overlap",
      "metric_reverse": "true",
      "text": "This means people are less likely to <span class=pink>know the same people</span> prior to meeting.\\r\\n\\r\\n\\r\\nThey’re on a social island, for better or worse."
    },
    {
      "chart_title": "Shared connections, 2022",
      "sort_var": "w3_relationship_duration_bucket",
      "metric": "w3_no_friend_overlap",
      "metric_reverse": "true",
      "addclass": "longcopy",
      "text": "Pandemic lockdowns accentuated this isolation. Some couples were able to endure the towering expectations of their partnership, but many were not.\\r\\n\\r\\n\\r\\n“Modern relationships are cauldrons of contradictory longings: safety and excitement, grounding and transcendence, the comfort of love and the heat of passion. We want it all, and we want it with one person,” Perel writes.\\r\\n\\r\\n\\r\\nIt’s uncomfortable for me to read about how we’re *too* reliant on our partners. It feels like a critique of the relationship I’ve built with the most important person in my life—a relationship that has helped us survive an increasingly precarious and anti-social world.\\r\\n\\r\\n\\r\\nBut our history reveals that love stories aren’t just something that happens between two people. \\r\\nThe setting of the story, and all the other characters, are just as important. \\r\\n\\r\\n\\r\\nThey’ve always come with tradeoffs. We once married people for survival, which provided stability but not emotional satisfaction. We then married for companionship, which traded stability for love—though at the cost of rigid gender roles. And now we want our partners to fulfill a wide array of emotional, physical, and existential needs—but that can be an overwhelming task.\\r\\n\\r\\n\\r\\nYet what I can’t stop thinking about is all the conversations I’ve had about relationships while working on this story. People have suggested readings, told me anecdotes, and shared anxieties. All of them were wrestling, in their own way, with what it means to love someone in a world where we have to ask so much of one person. And they’ve made themselves vulnerable as they shared how they’re trying to make it work. Maybe the village is still here."
    },
    {
      "chart_title": "",
      "sort_var": "",
      "metric": "",
      "metric_reverse": "true",
      "addclass": "explore",
      "text": "**Explore the data** \\r\\n\\r\\n\\r\\n<div class=smallText>These icons each represent one person in the survey, and do not reflect the survey weights that researchers use to produce a representative analysis. Read more about this in the methodology below.</div>"
    }
  ],
  "methods": "The data for this story is from [How Couples Meet and Stay Together](https://data.stanford.edu/hcmst2017), which surveyed Americans in 2017, 2020, and 2022. To get a representative analysis, the researchers weighted each respondent based on demographic characteristics. But the main icon visualization represents each person as one icon. All of the icon visualizations in this piece reflect the general results of a weighted analysis, but the exact numbers may differ. The individual charts are produced using the representative weights.\\r\\n\\r\\n\\r\\n<h6>Data citation</h6>\\r\\nRosenfeld, Michael J., Reuben J. Thomas, and Sonia Hausen. 2023. How Couples Meet and Stay Together 2017-2020-2022 combined dataset. [Computer files]. Stanford, CA: Stanford University Libraries. https://data.stanford.edu/hcmst2017",
  "colors": {}
}`;var rt=w("<p></p>"),nt=w('<details><summary></summary> <div class="content"><!></div></details>');function at(r,t){let e=H(()=>typeof t.content=="string"),a=H(()=>t.open==="true");var o=nt(),s=v(o);W(s,()=>t.summary,!0),p(s);var d=f(s,2),_=v(d);{var g=l=>{var n=M(),h=S(n);W(h,()=>t.content),u(l,n)},c=l=>{var n=M(),h=S(n);B(h,17,()=>t.content,U,(b,y)=>{let m=()=>i(y).value;var x=rt();W(x,m,!0),p(x),u(b,x)}),u(l,n)};Z(_,l=>{i(e)?l(g):l(c,-1)})}p(d),p(o),z(()=>{o.open=i(a),de(o,"name",t.name)}),u(r,o)}var ot=w("<li></li>"),st=w("<ul></ul>");function it(r,t){var e=st();B(e,21,()=>t.li,U,(a,o)=>{var s=ot();W(s,()=>i(o),!0),p(s),u(a,s)}),p(e),u(r,e)}var lt=w("<li></li>"),ct=w("<ol></ol>");function ht(r,t){var e=ct();B(e,21,()=>t.li,U,(a,o)=>{var s=lt();W(s,()=>i(o),!0),p(s),u(a,s)}),p(e),u(r,e)}var ut=w("<p></p>"),pt=w("<section><!></section>");function dt(r,t){V(t,!0);const e={details:at,ul:it,ol:ht};let a=G(t,"components",19,()=>({})),o=G(t,"body",19,()=>[]);var s=M(),d=S(s);B(d,17,o,U,(_,g)=>{let c=()=>i(g).section,l=()=>i(g).content;const n=H(()=>c().toLowerCase().replace(/[^a-z0-9]/g,"")),h=H(()=>a()[c()]);var b=pt(),y=v(b);{var m=k=>{var T=M(),q=S(T);ne(q,()=>i(h),(P,j)=>{j(P,ae(l))}),u(k,T)},x=k=>{var T=M(),q=S(T);B(q,17,l,U,(P,j,L,F)=>{let D=()=>i(j).type,N=()=>i(j).value;const se=H(()=>a()[D()]||e[D()]),ve=H(()=>typeof N()=="string");var ie=M(),_e=S(ie);{var fe=I=>{var R=M(),J=S(R);ne(J,()=>i(se),($,Y)=>{Y($,ae(N))}),u(I,R)},ge=I=>{var R=ut();W(R,N,!0),p(R),u(I,R)},we=I=>{var R=M(),J=S(R);re(J,D,!1,($,Y)=>{var le=M(),be=S(le);W(be,N),u(Y,le)}),u(I,R)},ye=I=>{var R=M(),J=S(R);re(J,D,!1,($,Y)=>{Me($,()=>({...N()}))}),u(I,R)};Z(_e,I=>{i(se)?I(fe):D()==="text"?I(ge,1):i(ve)?I(we,2):I(ye,-1)})}u(P,ie)}),u(k,T)};Z(y,k=>{i(h)?k(m):k(x,-1)})}p(b),z(()=>de(b,"id",i(n))),u(_,b)}),u(r,s),X()}var mt=w('<p> </p> <progress max="100"></progress>',1);function vt(r,t){let e=G(t,"label",3,"A"),a=G(t,"value",3,0);var o=mt(),s=S(o),d=v(s,!0);p(s);var _=f(s,2);z(()=>{A(d,e()),ze(_,a())}),u(r,o)}var _t=w('<section id="cms"><h2>MicroCMS</h2> <code><pre> </pre></code> <!></section>');function ft(r,t){V(t,!0);const{body:e}=Ie,a={Test:vt};var o=_t(),s=f(v(o),2),d=v(s),_=v(d,!0);p(d),p(s);var g=f(s,2);dt(g,{get components(){return a},get body(){return e}}),p(o),z(c=>A(_,c),[()=>tt.replace(/\t/g," ")]),u(r,o),X()}const gt=(r,t=pe)=>{var e=wt(),a=v(e),o=v(a,!0);p(a);var s=f(a,2),d=v(s,!0);p(s),p(e),z(()=>{A(o,t().name),A(d,t().age)}),u(r,e)};var wt=w('<div class="person svelte-q3gttf"><p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p></div>'),yt=w('<h2>Svelte5</h2> <h3>Reactive variables 3 ways:</h3> <button class="svelte-q3gttf">count++</button> <p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p> <p class="svelte-q3gttf"> </p> <h3>Children (previously slots):</h3> <div class="children"><!></div> <h3>Dispatch Event</h3> <button class="svelte-q3gttf">Random</button>  <h3>Snippets</h3> <div class="people svelte-q3gttf"></div>',1);function bt(r,t){V(t,!0),G(t,"age",3,30);const e=[{name:"John",age:30},{name:"Jill",age:45}];let a=O(0),o=H(()=>i(a)*2),s=H(()=>i(a)*2),d=O(0);oe(()=>{E(d,i(a)*2)});var _=yt(),g=f(S(_),4),c=f(g,2),l=v(c);p(c);var n=f(c,2),h=v(n);p(n);var b=f(n,2),y=v(b);p(b);var m=f(b,4),x=v(m);Re(x,()=>t.children??pe),p(m);var k=f(m,4),T=f(k,4);B(T,21,()=>e,U,(q,P)=>{gt(q,()=>i(P))}),p(T),z(()=>{A(l,`${i(a)??""} doubled is ${i(o)??""} (derived)`),A(h,`${i(a)??""} doubled is ${i(s)??""} (derived by)`),A(y,`${i(a)??""} doubled is ${i(d)??""} ($effect)`)}),ce("click",g,()=>xe(a)),ce("click",k,()=>t.random(Math.floor(Math.random()*10))),u(r,_),X()}Ce(["click"]);const kt=(r,t)=>{let e=O(Se(r)),a=O(null),o=O(!0),s=O(void 0);const d=(c=!0)=>{E(o,c,!0),c===!0&&(E(s,null),E(a,null))},_=async()=>{try{const c=await fetch(i(e),t);if(!c.ok)throw new Error(`Unexpected error occurred (status ${c.status})`);let l;if(i(e).includes(".csv")){const n=await c.text();l=Pe(n)}else l=await c.json();return[null,l]}catch(c){const{errorMessage:l="Unexpected error eccurred"}=c;return[l,null]}},g=async c=>{d(!0);const[l,n]=await _();if(c===i(e)){if(l){d(!1),E(s,l,!0);return}d(!1),E(a,n,!0)}};return oe(()=>{g(i(e))}),{get data(){return i(a)},get loading(){return i(o)},get error(){return i(s)},get url(){return i(e)},set url(c){i(e)!==c&&E(e,c,!0)}}};var xt=w("<p>loading data...</p>"),St=w("<p> </p>"),Tt=w("<p>data loaded</p> <pre> </pre>",1),Ct=w('<div class="c"><h2>Load Data</h2> <div class="response"><!></div></div>');function At(r,t){V(t,!0);const e=`${De}/assets/demo/test.csv`,a=kt(e);oe(()=>{});var o=Ct(),s=f(v(o),2),d=v(s);{var _=l=>{var n=xt();u(l,n)},g=l=>{var n=St(),h=v(n);p(n),z(()=>A(h,`error: ${a.error??""}`)),u(l,n)},c=l=>{var n=Tt(),h=f(S(n),2),b=v(h,!0);p(h),z(y=>A(b,y),[()=>JSON.stringify(a.data,null,2)]),u(l,n)};Z(d,l=>{a.loading?l(_):a.error?l(g,1):l(c,-1)})}p(s),p(o),u(r,o),X()}var Mt=w('<div id="demo" class="svelte-15aotx7"><h1>Demo</h1> <!> <!> <!> <!> <!> <!> <!> <!></div>');function zt(r){let t=O(0);function e(h){console.log(h)}var a=Mt(),o=f(v(a),2);We(o);var s=f(o,2);Fe(s);var d=f(s,2);Je(d);var _=f(d,2);Ve(_);var g=f(_,2);ft(g,{});var c=f(g,2);At(c,{});var l=f(c,2);et(l);var n=f(l,2);bt(n,{random:e,get value(){return i(t)},set value(h){E(t,h,!0)}}),p(a),u(r,a)}function Nt(r){zt(r)}export{Nt as component};
