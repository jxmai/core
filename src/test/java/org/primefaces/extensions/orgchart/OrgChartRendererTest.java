package org.primefaces.extensions.orgchart;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.primefaces.extensions.component.orgchart.DefaultOrgChartNode;
import org.primefaces.extensions.component.orgchart.OrgChartNode;
import org.primefaces.extensions.component.orgchart.OrgChartRenderer;

public class OrgChartRendererTest {

    OrgChartRenderer renderer = new OrgChartRenderer();

    OrgChartNode root = new DefaultOrgChartNode("root", "root");

    @Before
    public void before() {
	OrgChartNode child1 = new DefaultOrgChartNode("children 1", "children 1");
	OrgChartNode child2 = new DefaultOrgChartNode("children 2", "children 2");
	
	child1.setParent(root);
	child2.setParent(root);
	
        root.addChild(child1);
        root.addChild(child2);
    }

    @After
    public void after() {

    }

    @Test
    public void testToJSON() {

        // not a formal test. Only to print the result to console
        System.out.println(renderer.toJSON(root, root.getChildren()));

    }
    
    @Test
    public void testParent() {
	
	assertEquals(root.getChildren().get(0).getParent(), root);
    }

}
