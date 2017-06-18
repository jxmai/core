package org.primefaces.extensions.orgchart;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotSame;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.primefaces.extensions.component.orgchart.DefaultOrgChartNode;
import org.primefaces.extensions.component.orgchart.OrgChartHelper;
import org.primefaces.extensions.component.orgchart.OrgChartNode;
import org.primefaces.extensions.component.orgchart.OrgChartRenderer;
import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONObject;

public class OrgChartHelperTest {

    OrgChartNode root = new DefaultOrgChartNode("root", "root");

    @Before
    public void before() {

    }

    @After
    public void after() {
	root.clearChildren();
    }

    @Test
    public void testGetAllNodesTraverseFromRoot() {

	OrgChartNode child1 = new DefaultOrgChartNode("children 1", "children 1");
	OrgChartNode child2 = new DefaultOrgChartNode("children 2", "children 2");
	OrgChartNode child3 = new DefaultOrgChartNode("children 3", "children 3");

	child1.setParent(root);
	child2.setParent(root);

	root.addChild(child1);
	root.addChild(child2);

	List<OrgChartNode> orgChartNodes = OrgChartHelper.getAllNodesTraverseFromRoot(root);

	assertEquals(true, orgChartNodes.contains(child1));
	assertEquals(true, orgChartNodes.contains(child2));
	assertEquals(false, orgChartNodes.contains(child3));
	assertEquals(true, orgChartNodes.contains(root));
	assertEquals(3, orgChartNodes.size());
    }

    @Test
    public void testGetAllNodesTraverseFromRoot_2() {

	OrgChartNode child1 = new DefaultOrgChartNode("children 1", "children 1");
	OrgChartNode child2 = new DefaultOrgChartNode("children 2", "children 2");
	OrgChartNode child3 = new DefaultOrgChartNode("children 3", "children 3");
	OrgChartNode grandChild1 = new DefaultOrgChartNode("grand child1", "grand child1");

	child1.setParent(root);
	child2.setParent(root);

	root.addChild(child1);
	root.addChild(child2);

	child1.addChild(grandChild1);

	List<OrgChartNode> orgChartNodes = OrgChartHelper.getAllNodesTraverseFromRoot(root);
	assertEquals(true, orgChartNodes.contains(child1));
	assertEquals(true, orgChartNodes.contains(child2));
	assertEquals(false, orgChartNodes.contains(child3));
	assertEquals(true, orgChartNodes.contains(root));
	assertEquals(true, orgChartNodes.contains(grandChild1));
	assertEquals(4, orgChartNodes.size());
    }

    @Test
    public void testParseOrgChartNodesIntoHashMap() {
	List<OrgChartNode> orgChartNodes = new ArrayList<OrgChartNode>();
	OrgChartNode node1 = new DefaultOrgChartNode("id1", "name1", "title1");
	OrgChartNode node2 = new DefaultOrgChartNode("id2", "name2", "title2");
	OrgChartNode node3 = new DefaultOrgChartNode("id3", "name3", "title3");
	orgChartNodes.add(node1);
	orgChartNodes.add(node2);
	orgChartNodes.add(node3);

	HashMap<String, OrgChartNode> hashMap = OrgChartHelper.parseOrgChartNodesIntoHashMap(orgChartNodes);

	assertEquals(node1, hashMap.get("id1"));
	assertEquals(node2, hashMap.get("id2"));
	assertEquals(node3, hashMap.get("id3"));
	assertNotSame(node2, hashMap.get("id3"));
	assertEquals(3, hashMap.size());

    }

    @Test
    public void testBuildNodesFromJSON() {

	OrgChartRenderer orgChartRenderer = new OrgChartRenderer();

	List<OrgChartNode> orgChartNodes = new ArrayList<OrgChartNode>();
	OrgChartNode orgChartNode = new DefaultOrgChartNode("id1", "name1", "title1");
	OrgChartNode orgChartNode2 = new DefaultOrgChartNode("id2", "name2", "title2");
	orgChartNodes.add(orgChartNode);
	orgChartNodes.add(orgChartNode2);

	HashMap<String, OrgChartNode> hashMap = OrgChartHelper.parseOrgChartNodesIntoHashMap(orgChartNodes);

	JSONObject jsonObject = new JSONObject();
	jsonObject.put("id", "id1");
	JSONArray jsonArray = new JSONArray();
	JSONObject jsonObject2 = new JSONObject();
	jsonObject2.put("id", "id2");
	jsonArray.put(jsonObject2);
	jsonObject.put("children", jsonArray);

	OrgChartNode chartNode = orgChartRenderer.buildNodesFromJSON(hashMap, jsonObject, null);

	assertEquals("id1", chartNode.getId());
	assertEquals(1, chartNode.getChildren().size());

    }
}
